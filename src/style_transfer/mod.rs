use lazy_static::lazy_static;
use tch;
use tch::{CModule, vision::image, Tensor};
use rocket::response::Redirect;
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};
use std::io;
use tempfile::{Builder, NamedTempFile};
use std::ffi::OsStr;


lazy_static! {
    static ref ENCODER: CModule = tch::CModule::load("src/style_transfer/encoder.pt").unwrap();
    static ref MATRIX: CModule = tch::CModule::load("src/style_transfer/matrix.pt").unwrap();
    static ref DECODER: CModule = tch::CModule::load("src/style_transfer/decoder.pt").unwrap();
}

fn fetch_image(url: String) -> NamedTempFile {
    let mut resp = reqwest::blocking::get(&url).expect("request failed");
    let sname = url.as_str()
                   .rsplit('/')
                   .next()
                   .unwrap();
    let mut out = Builder::new()
            .prefix(sname)
            .suffix(".jpg")
            .tempfile()
            .unwrap();
    io::copy(&mut resp, &mut out).expect("failed to copy content");
    out
}

pub fn transform_(content: Vec<u8>, shape: [i64; 2], style_url: String) -> String{
    //let content = image::load("src/style_transfer/chicago.png").unwrap()
   let content = Tensor::of_slice(content.as_slice())
                    .reshape(&[shape[0], shape[1], 3])
                    .unsqueeze(0)
                    .to_kind(tch::Kind::Float) / 255.;
    let (_n, _c, ch, cw) = content.size4().unwrap();

    let style_file = fetch_image(style_url);
    let sname = style_file
        .path()
        .file_name()
        .and_then(OsStr::to_str)
        .unwrap();
    let mut style = image::load(sname)
                    .unwrap();
    style = image::resize(&style, cw, ch)
                    .unwrap()
                    .unsqueeze(0)
                    .to_kind(tch::Kind::Float) / 255.;

    let c_f = ENCODER.forward_ts(&[content]).unwrap();
    let s_f = ENCODER.forward_ts(&[style]).unwrap();
    let mut image = Tensor::cat(&[c_f,s_f], 0);
    image = MATRIX.forward_ts(&[image]).unwrap();
    image = DECODER.forward_ts(&[image]).unwrap().squeeze();
    image = image.clamp(0,1) * 255.;
    image = image.to_kind(tch::Kind::Uint8);

    let hash = md5::compute(sname.to_string().into_bytes());
    let fname = format!("{:x}.jpg", hash);
    image::save(&image, &fname).unwrap();
    fname
}

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct Input {
    file: String,
    artworkId: String,
}

#[post("/transform", data = "<input>")]
pub fn transform(input: Json<Input>) -> Redirect {
    //let fname = transform_(input.file, input.shape, input.artworkId);
    Redirect::to(uri!(get_transformed_image: "xd"))
}

#[get("/result/<fname>")]
pub fn get_transformed_image(fname: String) -> String {
    "OK".to_string()
    //Option<NamedFile> {
    //NamedFile::open(Path::new("static/build/index.html")).ok()
}

