use lazy_static::lazy_static;
use tch;
use tch::{CModule, Tensor};
use tch::vision::image as tch_image;
use rocket::response::{Redirect,NamedFile};
use rocket_contrib::json::Json;
use serde::Deserialize;
use std::io;
use tempfile::Builder;
use base64;
use image;

lazy_static! {
    static ref ENCODER: CModule = tch::CModule::load("src/style_transfer/encoder.pt").unwrap();
    static ref MATRIX: CModule = tch::CModule::load("src/style_transfer/matrix.pt").unwrap();
    static ref DECODER: CModule = tch::CModule::load("src/style_transfer/decoder.pt").unwrap();
}

fn fetch_style_image(url: &String) -> (Tensor, String) {
    let mut resp = reqwest::blocking::get(url).expect("request failed");
    let extension = url.rsplit('.').next().unwrap();
    let extension = format!(".{}", extension);
    let mut sfile = Builder::new()
            .suffix(&extension)
            .tempfile()
            .unwrap();
    io::copy(&mut resp, &mut sfile).expect("failed to copy content");
    let sname = sfile
        .path()
        .to_str()
        .unwrap()
        .to_string();
    let style = tch_image::load(&sname).unwrap();
    sfile.close().unwrap();
    (style, sname)
}

fn decode_content(input: &Json<Input>) -> (Tensor, i64, i64) {
    let content_bytes: Vec<u8> = base64::decode(&input.file[22..]).unwrap();
    let content_raw = image::load_from_memory(&content_bytes).unwrap();

    let cfile = Builder::new()
                     .suffix(".jpg")
                     .tempfile()
                     .unwrap();
    let cname = cfile.path().to_str().unwrap().to_string();
    content_raw.save(&cname).unwrap();
    let mut content = tch_image::load(&cname).unwrap();
    let (_, mut ch, mut cw) = content.size3().unwrap();
    if ch > 600 {
        let new_ch = 500;
        let new_cw = (cw as f32 / ch as f32 * new_ch as f32) as i64;
        content = tch_image::resize(&content, new_cw, new_ch).unwrap();
        ch = new_ch;
        cw = new_cw;
    }
    (content, ch, cw)
}


pub fn transform_(input: Json<Input>) -> String {
    let (mut content, height, width) = decode_content(&input);
    let (style_raw, sname) = fetch_style_image(&input.artworkId);
    let style = tch_image::resize(&style_raw, width, height)
                         .unwrap()
                         .unsqueeze(0)
                         .to_kind(tch::Kind::Float) / 255.;
    content = content.unsqueeze(0)
                     .to_kind(tch::Kind::Float) / 255.;

    let c_f = ENCODER.forward_ts(&[content]).unwrap();
    let s_f = ENCODER.forward_ts(&[style]).unwrap();
    let mut image = Tensor::cat(&[c_f,s_f], 0);
    image = MATRIX.forward_ts(&[image]).unwrap();
    image = DECODER.forward_ts(&[image]).unwrap().squeeze();
    image = image.clamp(0,1) * 255.;
    image = image.to_kind(tch::Kind::Uint8);

    let hash = md5::compute(sname.to_string().into_bytes());
    let fname = format!("{:x}{:?}.jpg", hash, std::time::SystemTime::now()).replace(" ", "");
    tch_image::save(&image, &fname).unwrap();
    fname
}

#[derive(Deserialize)]
#[allow(non_snake_case)]
pub struct Input {
    artworkId: String,
    file: String,
    width: i64,
    height: i64,
}

#[post("/transform", data = "<input>")]
pub fn transform(input: Json<Input>) -> Redirect {
    let fname = transform_(input);
    Redirect::to(uri!("/api" , get_transformed_image: fname))
}

#[get("/result/<path>")]
pub fn get_transformed_image(path: String) -> Option<NamedFile> {
    let file = NamedFile::open(&path).ok();
    std::fs::remove_file(path).unwrap();
    file
}

