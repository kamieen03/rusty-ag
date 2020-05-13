use serde::{Serialize,Deserialize};
use rocket_contrib::json::Json;
use lazy_static::lazy_static;

lazy_static! {
    static ref CLIENT: reqwest::blocking::Client = reqwest::blocking::Client::new();
}


#[derive(Serialize,Deserialize)]
#[derive(Debug)]
#[allow(non_snake_case)]
pub struct Artwork {
    artistUrl: String,
    url: String,
    dictionaries: Vec<i32>,
    location: Option<String>,
    period: String,
    serie: Option<String>,
    genre: String,
    material: Option<String>,
    style: String,
    technique: Option<String>,
    sizeX: Option<f32>, 
    sizeY: Option<f32>,
    diameter: Option<f32>,
    auction: Option<String>,
    yearOfTrade: Option<i32>,
    lastPrice: Option<String>,
    galleryName: Option<String>,
    tags: Option<String>,
    description: Option<String>,
    title: String,
    contentId: i64,
    artistContentId: i64,
    artistName: String,
    completitionYear: Option<i32>,
    yearAsString: Option<String>,
    width: i32,
    image: String,
    height: i32
}

fn get_artwork(id: i64) -> reqwest::Result<Artwork> {
    let url = format!("https://www.wikiart.org/en/App/Painting/ImageJson/{}", id);
    let artwork = CLIENT.get(&url)
                        .send()?
                        .json::<Artwork>()?;
    Ok(artwork)
}

#[get("/paintings/<id>")]
pub fn artwork(id: i64) -> Json<Artwork> {
    Json(get_artwork(id).unwrap())
}
