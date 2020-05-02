use serde::{Serialize,Deserialize};
use rocket_contrib::json::Json;
use scraper::{Html,Selector};
use std::collections::HashMap;
use lazy_static::lazy_static;


lazy_static! {
    pub static ref artist_map: HashMap<String,String> = {
        let path = "static/artists.json";
        let json = std::fs::read_to_string(path).unwrap();
        serde_json::from_str(&json).unwrap()
    };
}


#[derive(Serialize)]
struct Artist {
    name: String,
    url: String
}

#[derive(Serialize)]
struct Artwork {
    img_url: String,
    name: String,
    author: Artist,
    year: u32
}


#[derive(Serialize)]
pub struct SearchData {
    artists: Vec<Artist>,
    artworks: Vec<Artwork>
}


fn get_html(query: String) -> Result<String, reqwest::Error> {
    let url = "https://www.wikiart.org/en/Search/".to_string() + &query;
    reqwest::blocking::get(&url)?.text()
}

fn get_artists(query: &String) -> Vec<Artist> {
    artist_map.iter()
              .filter(|(k,v)| k.contains(&query.as_str().to_lowercase()))
              .map(|(k,v)| Artist{name: v.to_string(),
                                  url: format!("{}{}", "https://www.wikiart.org/en/",k)}) 
              .collect()
}
    //let base_selector = Selector::parse("ul.wiki-artistgallery-container.ng-isolate-scope").unwrap();
    //let parsed = Html::parse_document(&html);
    //let artists = parsed.select(&base_selector).next().unwrap();
    //println!("{}", artists.inner_html());
    //vec![]

//fn parse_html(html: String) -> Json<SearchData> {
//    let artists = get_artists(&html);
//    Json(SearchData{artists, artworks: vec![]})
//}


#[get("/search/<query>")]
pub fn search(query: String) -> Json<SearchData> {
    let artists = get_artists(&query);
    Json(SearchData{artists, artworks: vec![]})
    //match get_html(query) {
    //    Ok(html) => parse_html(html),
    //    Err(_) => Json(SearchData{artists: vec![], artworks: vec![]})
    //}
}

