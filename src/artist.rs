use futures::{self, executor::block_on};
use rocket_contrib::json::Json;

mod artist_info {
    use lazy_static::lazy_static;
    use scraper::{Html, Selector};
    use serde::{Deserialize, Serialize};

    lazy_static! {
        static ref CLIENT: reqwest::Client = reqwest::Client::new();
    }

    #[derive(Serialize, Deserialize, Debug)]
    #[allow(non_snake_case)]
    pub struct ArtistInfoAPI {
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

    #[derive(Serialize)]
    pub struct WikipediaBiography {
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
    }

    impl Artist {
        pub fn new(info: ArtistInfoAPI, wiki_info: WikipediaBiography) -> Self {
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

    async fn fetch_wiki_info(url: &String) -> Result<WikipediaBiography, reqwest::Error> {
        let url = format!("https://www.wikiart.org/en/{}", url);
        let html = CLIENT.get(&url).send().await?.text().await?;
        let document = Html::parse_document(&html);
        let selector =
            Selector::parse("div.wiki-layout-artist-info-tab[id=info-tab-wikipediaArticle]")
                .unwrap();
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

    pub async fn fetch_data(
        url: &String,
    ) -> (
        reqwest::Result<ArtistInfoAPI>,
        reqwest::Result<WikipediaBiography>,
    ) {
        let f1 = fetch_artist_info(url);
        let f2 = fetch_wiki_info(url);
        futures::join!(f1, f2)
    }
}

mod paintings {
    use lazy_static::lazy_static;
    use serde::{Deserialize, Serialize};

    lazy_static! {
        static ref BLOCKING_CLIENT: reqwest::blocking::Client = reqwest::blocking::Client::new();
    }

    #[derive(Serialize, Deserialize)]
    #[allow(non_snake_case)]
    pub struct PaintingShortInfoAPI {
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

    pub fn fetch_paintings(url: &String) -> Result<Vec<PaintingShortInfoAPI>, reqwest::Error> {
        let url = format!(
            "https://www.wikiart.org/en/App/Painting/PaintingsByArtist?artistUrl={}&json=2",
            url
        );
        let paintings = BLOCKING_CLIENT
            .get(&url)
            .send()?
            .json::<Vec<PaintingShortInfoAPI>>()?;
        Ok(paintings)
    }
}

#[tokio::main]
#[get("/artist/<url>")]
pub async fn artist(url: String) -> Json<artist_info::Artist> {
    let (artist_info, wiki) = block_on(artist_info::fetch_data(&url));
    let artist_info = artist_info.unwrap();
    let wiki = wiki.unwrap();
    Json(artist_info::Artist::new(artist_info, wiki))
}

#[get("/artist/<url>/paintings")]
pub fn artist_paintings(url: String) -> Json<Vec<paintings::PaintingShortInfoAPI>> {
    Json(paintings::fetch_paintings(&url).unwrap())
}
