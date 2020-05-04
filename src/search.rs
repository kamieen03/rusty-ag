use serde::{Serialize};
use rocket_contrib::json::Json;

mod artist {
    #![allow(non_snake_case)]

    use std::collections::HashMap;
    use lazy_static::lazy_static;
    use serde::{Serialize};

    lazy_static! {
        static ref ARTIST_MAP: HashMap<String,String> = {
            let path = "static/artists.json";
            let json = std::fs::read_to_string(path).unwrap();
            serde_json::from_str(&json).unwrap()
        };
    }

    #[derive(Serialize)]
    pub struct Artist {
        name: String,
        url: String
    }

    impl Artist {
        pub fn new(name: String, url_end: String) -> Self {
            Artist{name,
                   url: format!("{}{}", "https://www.wikiart.org/en/", url_end)} 
        }
    }


    pub fn get_artists(query: &String) -> Vec<Artist> {
        ARTIST_MAP.iter()
                  .filter(|(k,_)| k.contains(&query.as_str().to_lowercase()))
                  .map(|(k,v)| Artist::new(v.to_string(), k.to_string())) 
                  .collect()
    }
}

mod artwork {
    #![allow(non_snake_case)]

    use serde::{Serialize,Deserialize};
    use super::artist::Artist;
    use lazy_static::lazy_static;

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
        height: i32
    }

    #[derive(Deserialize)]
    #[allow(dead_code)]
    struct ArtworkSearchAPI {
        data: Vec<ArtworkSearchData>,
        paginationToken: String,
        hasMore: bool
    }

    #[derive(Serialize)]
    pub struct Artwork {
        img_url: String,
        name: String,
        author: Artist,
        year: Option<i32>
    }

    pub fn get_artworks(query: &String) -> Result<Vec<Artwork>, reqwest::Error> {
        let url = format!("{}{}", "https://www.wikiart.org/en/api/2/PaintingSearch?term=", query);
        let artworks = CLIENT.get(&url)
                             .send()?
                             .json::<ArtworkSearchAPI>()?
                             .data.iter()
                             .map(|asd| Artwork{img_url: asd.image.clone(),
                                                name: asd.title.clone(),
                                                author: Artist::new(asd.artistName.clone(),
                                                                    asd.artistUrl.clone()),
                                                year: asd.completitionYear})
                             .collect();
        Ok(artworks)
    }
}

mod style {
    use lazy_static::lazy_static;
    use serde::{Serialize,Deserialize};

    lazy_static! {
        static ref STYLES: Vec<Style> = {
            let path = "static/styles.json";
            let json = std::fs::read_to_string(path).unwrap();
            serde_json::from_str::<Vec<Style>>(&json).unwrap()
                            .iter()
                            .map(|s| Style::new(s.title.clone(), s.url.clone()))
                            .collect()
        };
    }

    #[derive(Serialize,Deserialize)]
    #[derive(Clone)]
    pub struct Style {
        title: String, 
        url: String
    }

    impl Style {
        fn new(title: String, url_name: String) -> Self {
            Style{title,
                  url: format!("{}{}", "https://www.wikiart.org/en/paintings-by-style/", url_name)}
        }
    }

    pub fn get_styles(query: &String) -> Vec<Style> {
        STYLES.iter()
              .filter(|s| s.title.to_lowercase().contains(&query.as_str().to_lowercase()))
              .map(|s| s.clone())
              .collect()
    }

}

#[derive(Serialize)]
pub struct SearchData {
    artists: Vec<artist::Artist>,
    artworks: Vec<artwork::Artwork>,
    styles: Vec<style::Style>
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
    Json(SearchData{artists, artworks, styles})
}
