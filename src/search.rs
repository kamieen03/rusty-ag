use rocket_contrib::json::Json;
use serde::Serialize;

mod artist {
    #![allow(non_snake_case)]

    use lazy_static::lazy_static;
    use serde::Serialize;
    use std::collections::HashMap;

    lazy_static! {
        static ref ARTISTS: Vec<Artist> = {
            let path = "static/artists.json";
            let json = std::fs::read_to_string(path).unwrap();
            serde_json::from_str::<HashMap<String, String>>(&json)
                .unwrap()
                .iter()
                .map(|(k, v)| Artist {
                    name: v.to_string(),
                    url: k.to_string(),
                })
                .collect()
        };
    }

    #[derive(Serialize, Clone)]
    pub struct Artist {
        pub name: String,
        pub url: String,
    }

    pub fn get_artists(query: &String) -> Vec<Artist> {
        ARTISTS
            .iter()
            .filter(|a| a.url.contains(&query.as_str().to_lowercase()))
            .map(|a| a.clone())
            .collect()
    }
}

mod artwork {
    #![allow(non_snake_case)]

    use lazy_static::lazy_static;
    use serde::{Deserialize, Serialize};

    lazy_static! {
        static ref CLIENT: reqwest::blocking::Client = reqwest::blocking::Client::new();
    }

    //TODO: perhpas more fields should be of type Option<T>; needs testing
    #[derive(Deserialize)]
    #[allow(dead_code)]
    struct ArtworkSearchData {
        id: String,
        title: String,
        url: Option<String>,
        artistUrl: String,
        artistName: String,
        artistId: String,
        completitionYear: Option<i32>,
        width: i32,
        image: String,
        height: i32,
    }

    #[derive(Deserialize)]
    #[allow(dead_code)]
    struct WrapperArtworkSearchData {
        data: Vec<ArtworkSearchData>,
        paginationToken: String,
        hasMore: bool,
    }

    #[derive(Serialize)]
    pub struct Artwork {
        img_url: String,
        id: String,
        name: String,
        author: String,
        year: Option<i32>,
    }

    pub fn get_artworks(query: &String) -> Result<Vec<Artwork>, reqwest::Error> {
        let url = format!(
            "https://www.wikiart.org/en/api/2/PaintingSearch?term={}",
            query
        );
        let artworks = CLIENT
            .get(&url)
            .send()?
            .json::<WrapperArtworkSearchData>()?
            .data
            .into_iter()
            .map(|asd| Artwork {
                img_url: asd.image,
                id: asd.id,
                name: asd.title,
                author: asd.artistName,
                year: asd.completitionYear,
            })
            .collect();
        Ok(artworks)
    }
}

mod style {
    use lazy_static::lazy_static;
    use serde::{Deserialize, Serialize};

    lazy_static! {
        static ref STYLES: Vec<Style> = {
            let path = "static/styles.json";
            let json = std::fs::read_to_string(path).unwrap();
            serde_json::from_str::<Vec<Style>>(&json).unwrap()
        };
    }

    #[derive(Serialize, Deserialize, Clone)]
    pub struct Style {
        title: String,
        url: String,
    }

    pub fn get_styles(query: &String) -> Vec<Style> {
        STYLES
            .iter()
            .filter(|s| s.url.contains(&query.as_str().to_lowercase()))
            .map(|s| s.clone())
            .collect()
    }
}

#[derive(Serialize)]
pub struct SearchData {
    artists: Vec<artist::Artist>,
    artworks: Vec<artwork::Artwork>,
    styles: Vec<style::Style>,
}

#[get("/search/<query>")]
pub fn search(query: String) -> Json<SearchData> {
    let artists = artist::get_artists(&query);
    let artworks = match artwork::get_artworks(&query) {
        Ok(works) => works,
        Err(msg) => {
            println!("{}", msg);
            vec![]
        }
    };
    let styles = style::get_styles(&query);
    Json(SearchData {
        artists,
        artworks,
        styles,
    })
}
