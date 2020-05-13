use futures::{self, executor::block_on};
use lazy_static::lazy_static;
use rocket_contrib::json::Json;
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};

lazy_static! {
    static ref CLIENT: reqwest::Client = reqwest::Client::new();
}

#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
struct ArtistInfoAPI {
    relatedArtistsIds: Vec<String>,
    OriginalArtistName: String,
    activeYearsCompletion: Option<i32>,
    activeYearsStart: Option<i32>,
    artistName: String,
    biography: Option<String>, // if empty then "", not null
    birthDay: String,          // weird format
    birthDayAsString: String,
    contentId: i64,
    deathDay: String, //weird format
    deathDayAsString: Option<String>,
    dictonaries: Vec<i32>,
    gender: String,
    image: String,
    lastNameFirst: String,
    periodsOfWork: String,
    series: String,
    story: String,
    themes: String,
    url: String,
    wikipediaUrl: String,
}

#[derive(Serialize, Deserialize)]
#[allow(non_snake_case)]
struct PaintingShortInfoAPI {
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

#[derive(Serialize)]
struct WikipediaBiography {
    data: String,
}

#[derive(Serialize)]
pub struct Artist {
    name: String,
    long_name: String,
    birth: String,
    death: Option<String>,
    sex: String,
    image_url: String,
    biography: Option<String>,
    wiki_biography: WikipediaBiography,
    wiki_url: String,
    paintings: Vec<PaintingShortInfoAPI>,
}

impl Artist {
    fn new(
        info: ArtistInfoAPI,
        paintings: Vec<PaintingShortInfoAPI>,
        wiki_info: WikipediaBiography,
    ) -> Self {
        Artist {
            name: info.artistName,
            long_name: info.OriginalArtistName,
            birth: info.birthDayAsString,
            death: info.deathDayAsString,
            sex: info.gender,
            image_url: info.image,
            biography: match info.biography {
                Some(bio) if bio.len() > 5 => Some(bio),
                _ => None,
            },
            wiki_biography: wiki_info,
            wiki_url: info.wikipediaUrl,
            paintings,
        }
    }
}

async fn fetch_artist_info(url: &String) -> Result<ArtistInfoAPI, reqwest::Error> {
    let url = format!("https://www.wikiart.org/en/{}?json=2", url);
    let info = CLIENT
        .get(&url)
        .send()
        .await?
        .json::<ArtistInfoAPI>()
        .await?;
    Ok(info)
}

async fn fetch_paintings(url: &String) -> Result<Vec<PaintingShortInfoAPI>, reqwest::Error> {
    let url = format!(
        "https://www.wikiart.org/en/App/Painting/PaintingsByArtist?artistUrl={}&json=2",
        url
    );
    let paintings = CLIENT
        .get(&url)
        .send()
        .await?
        .json::<Vec<PaintingShortInfoAPI>>()
        .await?;
    Ok(paintings)
}

async fn fetch_wiki_info(url: &String) -> Result<WikipediaBiography, reqwest::Error> {
    let url = format!("https://www.wikiart.org/en/{}", url);
    let html = CLIENT.get(&url).send().await?.text().await?;
    let document = Html::parse_document(&html);
    let selector =
        Selector::parse("div.wiki-layout-artist-info-tab[id=info-tab-wikipediaArticle]").unwrap();
    let bio: String = document
        .select(&selector)
        .next()
        .unwrap()
        .select(&Selector::parse("p").unwrap())
        .next()
        .unwrap()
        .text()
        .collect();
    Ok(WikipediaBiography { data: bio })
}

async fn fetch_data(
    url: &String,
) -> (
    reqwest::Result<ArtistInfoAPI>,
    reqwest::Result<Vec<PaintingShortInfoAPI>>,
    reqwest::Result<WikipediaBiography>,
) {
    let f1 = fetch_artist_info(url);
    let f2 = fetch_paintings(url);
    let f3 = fetch_wiki_info(url);
    futures::join!(f1, f2, f3)
}

#[tokio::main]
#[get("/artist/<url>")]
pub async fn artist(url: String) -> Json<Artist> {
    let (artist_info, paintings, wiki) = block_on(fetch_data(&url));
    let artist_info = artist_info.unwrap();
    let paintings = paintings.unwrap();
    let wiki = wiki.unwrap();
    Json(Artist::new(artist_info, paintings, wiki))
}

//TODO: test whether more fields should be Option<T>
