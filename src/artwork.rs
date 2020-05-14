use lazy_static::lazy_static;
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref CLIENT: reqwest::blocking::Client = reqwest::blocking::Client::new();
}

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case, dead_code)]
struct ArtworkAPIV1 {
    artistUrl: String,
    url: String,
    dictionaries: Vec<i32>,
    location: Option<String>,
    period: Option<String>,
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
    height: i32,
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct PeriodAPIV2 {
    id: String,
    title: String,
}

#[derive(Deserialize)]
#[allow(non_snake_case, dead_code)]
struct ArtworkAPIV2 {
    id: String,
    title: String,
    url: String,
    artistUrl: String,
    artistName: String,
    artistId: String,
    completitionYear: Option<i32>,
    dictionaries: Vec<String>,
    location: String,
    period: Option<PeriodAPIV2>,
    serie: Option<PeriodAPIV2>,
    genres: Vec<String>,
    styles: Vec<String>,
    media: Vec<String>,
    sizeX: Option<f32>,
    sizeY: Option<f32>,
    diameter: Option<f32>,
    galleries: Vec<String>,
    tags: Vec<String>,
    description: String,
    width: i32,
    image: String,
    height: i32,
}

enum ApiVersion {
    One,
    Two,
}

#[derive(Serialize)]
pub struct Artwork {
    title: String,
    artist_url: String,
    artist_name: String,
    completition_year: Option<i32>,
    location: Option<String>,
    period: Option<String>,
    serie: Option<String>,
    genres: Vec<String>,
    styles: Vec<String>,
    media: Vec<String>,
    size_x: Option<f32>,
    size_y: Option<f32>,
    gallery: Option<String>,
    tags: Vec<String>,
    description: Option<String>,
    image: String,
}

impl Artwork {
    fn from_v1(source: ArtworkAPIV1) -> Self {
        Artwork {
            title: source.title,
            artist_url: source.artistUrl,
            artist_name: source.artistName,
            completition_year: source.completitionYear,
            location: source.location,
            period: source.period,
            serie: source.serie,
            genres: source
                .genre
                .as_str()
                .split(',')
                .map(|s| s.trim().to_string())
                .collect(),
            styles: source
                .style
                .as_str()
                .split(',')
                .map(|s| s.trim().to_string())
                .collect(),
            media: source
                .material
                .unwrap_or("".to_string())
                .as_str()
                .split(',')
                .map(|s| s.trim().to_string())
                .collect(),
            size_x: source.sizeX,
            size_y: source.sizeY,
            gallery: source.galleryName,
            tags: source
                .tags
                .unwrap_or("".to_string())
                .as_str()
                .split(',')
                .map(|s| s.trim().to_string())
                .collect(),
            description: source.description,
            image: source.image,
        }
    }

    fn from_v2(mut source: ArtworkAPIV2) -> Self {
        Artwork {
            title: source.title,
            artist_url: source.artistUrl,
            artist_name: source.artistName,
            completition_year: source.completitionYear,
            location: match source.location.len() {
                0..=5 => None,
                _ => Some(source.location),
            },
            period: source.period.map(|p| p.title),
            serie: source.serie.map(|s| s.title),
            genres: source.genres,
            styles: source.styles,
            media: source.media,
            size_x: source.sizeX,
            size_y: source.sizeY,
            gallery: source.galleries.pop(),
            tags: source.tags,
            description: match source.description.len() {
                0..=5 => None,
                _ => Some(source.description),
            },
            image: source.image,
        }
    }
}

fn get_artwork<T>(id: T, version: ApiVersion) -> reqwest::Result<Artwork>
where
    T: std::fmt::Display,
{
    let url = match version {
        ApiVersion::One => format!("https://www.wikiart.org/en/App/Painting/ImageJson/{}", id),
        ApiVersion::Two => format!("https://www.wikiart.org/en/api/2/Painting?id={}", id),
    };
    let resp = CLIENT.get(&url).send()?;
    let artwork = match version {
        ApiVersion::One => Artwork::from_v1(resp.json::<ArtworkAPIV1>()?),
        ApiVersion::Two => Artwork::from_v2(resp.json::<ArtworkAPIV2>()?),
    };
    Ok(artwork)
}

#[get("/paintings/<id>")]
pub fn artwork_v1(id: i64) -> Json<Artwork> {
    Json(get_artwork(id, ApiVersion::One).unwrap())
}

#[get("/paintings/<id>", rank = 2)]
pub fn artwork_v2(id: String) -> Json<Artwork> {
    Json(get_artwork(id, ApiVersion::Two).unwrap())
}
