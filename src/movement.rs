use lazy_static::lazy_static;
use rocket_contrib::json::Json;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref CLIENT: reqwest::blocking::Client = reqwest::blocking::Client::new();
}

#[derive(Deserialize)]
#[allow(non_snake_case, dead_code)]
struct PaintingInfoWikiArt {
    _id: String,
    title: String,
    year: String,
    width: u32,
    height: u32,
    artistName: String,
    image: String,
    map: String,
    paintingUrl: String,
    artistUrl: String,
    albums: Option<String>,
    flags: i32,
    images: Option<Vec<ImageAPI>>,
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct ImageAPI {
    width: u32,
    height: u32,
    image: String,
    map: String,
}

#[derive(Serialize)]
pub struct Painting {
    id: String,
    title: String,
    year: String,
    artist_name: String,
    image: String,
}

impl Painting {
    fn from_wiki_art(source: PaintingInfoWikiArt) -> Self {
        Painting {
            id: source._id,
            title: source.title,
            year: source.year,
            artist_name: source.artistName,
            image: source.image,
        }
    }
}

#[derive(Deserialize)]
struct PaintingVecWrapper {
    data: Vec<PaintingInfoWikiArt>,
}

fn fetch_paintings(url: &String) -> Result<Vec<Painting>, Box<dyn std::error::Error>> {
    let url = format!(
        "https://www.wikiart.org/en/paintings-by-style/{}#!#filterName:all-works,viewType:masonry",
        url
    );
    let html = CLIENT.get(&url).send()?.text()?;
    let document = Html::parse_document(&html);
    let selector = Selector::parse("div.artworks-by-dictionary").unwrap();

    let paintings: &str = document
        .select(&selector)
        .next()
        .unwrap()
        .value()
        .attr("ng-init")
        .unwrap()
        .splitn(2, "\"_v\" : ")
        .last()
        .unwrap()
        .rsplitn(2, ", 'itemsCount'")
        .last()
        .unwrap();
    let paintings: String = "{\"data\": ".to_owned() + paintings;
    let paintings: PaintingVecWrapper = serde_json::from_str(&paintings)?;
    let paintings = paintings
        .data
        .into_iter()
        .map(|p| Painting::from_wiki_art(p))
        .collect();
    Ok(paintings)
}

#[get("/art_movement/<url>")]
pub fn movement(url: String) -> Json<Vec<Painting>> {
    Json(fetch_paintings(&url).unwrap())
}
