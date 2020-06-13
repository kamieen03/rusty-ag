use lazy_static::lazy_static;
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

lazy_static! {
    static ref CLIENT: reqwest::blocking::Client = reqwest::blocking::Client::new();

    static ref STYLES: HashMap<String, String> = {
        let path = "static/styles.json";
        let json = std::fs::read_to_string(path).unwrap();
        let temp = serde_json::from_str::<Vec<Style>>(&json);
        println!("{:?}", temp);

            temp.unwrap().into_iter()
            .map(|s| (s.name, format!("art_movement/{}", s.url)) )  //name, url
            .collect()
    };
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Style {
    name: String,
    url: String,
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
    genre: Option<String>,
    material: Option<String>,
    style: Option<String>,
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
    genres: Option<Vec<String>>,
    styles: Option<Vec<Style>>,
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
            genres: source.genre.map(|g| {
                g.as_str()
                    .split(',')
                    .map(|s| s.trim().to_string())
                    .collect()
            }),
            styles: source.style.map(|s| {
                s.as_str()
                    .split(',')
                    .filter_map(|s| {
                        let key = s.trim().to_string();
                        STYLES.get_key_value(&key).map(|(name, url)| Style {
                            name: name.to_string(),
                            url: url.to_string(),
                        })
                    })
                    .collect()
            }),
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
            genres: Some(source.genres),
            styles: {
                let s = source
                    .styles
                    .into_iter()
                    .filter_map(|s| {
                        STYLES.get_key_value(&s).map(|(name, url)| Style {
                            url: url.to_string(),
                            name: name.to_string(),
                        })
                    })
                    .collect();
                Some(s)
            },
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
