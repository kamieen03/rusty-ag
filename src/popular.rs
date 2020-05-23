use lazy_static::lazy_static;
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref CLIENT: reqwest::blocking::Client = reqwest::blocking::Client::new();
}
static URL: &str = "https://www.wikiart.org/en/api/2/MostViewedPaintings";

#[allow(dead_code, non_snake_case)]
#[derive(Deserialize)]
struct PaintingAPI {
    id: String,
    title: String,
    url: String,
    artistUrl: String,
    artistName: String,
    artistId: String,
    completitionYear: Option<i32>,
    width: i32,
    image: String,
    height: i32,
}

#[allow(dead_code, non_snake_case)]
#[derive(Deserialize)]
struct WrapperPaintingAPI {
    data: Vec<PaintingAPI>,
    paginationToken: String,
    hasMore: bool,
}

#[derive(Serialize)]
pub struct Painting {
    id: String,
    title: String,
    artist_url: String,
    artist_name: String,
    completition_year: Option<i32>,
    image: String,
}

impl Painting {
    fn from_api(p: PaintingAPI) -> Self {
        Painting {
            id: p.id,
            title: p.title,
            artist_url: p.artistUrl,
            artist_name: p.artistName,
            completition_year: p.completitionYear,
            image: p.image,
        }
    }
}

fn fetch_popular() -> reqwest::Result<Vec<Painting>> {
    let artworks = CLIENT
        .get(URL)
        .send()?
        .json::<WrapperPaintingAPI>()?
        .data
        .into_iter()
        .map(|p| Painting::from_api(p))
        .collect();
    Ok(artworks)
}

#[get("/popular")]
pub fn popular_paintings() -> Json<Vec<Painting>> {
    Json(fetch_popular().unwrap())
}
