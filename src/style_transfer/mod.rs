use lazy_static::lazy_static;
use tch;
use tch::{CModule, vision::image, Tensor};
use rocket::response::Redirect;
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};



lazy_static! {
    static ref ENCODER: CModule = tch::CModule::load("src/style_transfer/encoder.pt").unwrap();
    static ref MATRIX: CModule = tch::CModule::load("src/style_transfer/matrix.pt").unwrap();
    static ref DECODER: CModule = tch::CModule::load("src/style_transfer/decoder.pt").unwrap();
}

pub fn transform_() {
    let content = image::load("src/style_transfer/chicago.png").unwrap()
                    .unsqueeze(0)
                    .to_kind(tch::Kind::Float) / 255.;
    let (_n, _c, ch, cw) = content.size4().unwrap();
    let mut style = image::load("src/style_transfer/style.jpg")
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
    image::save(&image, "output.jpg").unwrap();
}

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)]
pub struct Input {
    file: Vec<u8>,
    artworkId: String,
}

#[post("/transform", data = "<input>")]
pub fn transform(input: Json<Input>) -> Redirect {
    let hash = "2137";
    Redirect::to(uri!(get_transformed_image: hash))
}

#[get("/result/<hash>")]
pub fn get_transformed_image(hash: String) -> String {
    "OK".to_string()
}

