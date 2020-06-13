use futures::{self, executor::block_on};
use rocket_contrib::json::Json;

mod artist_info {
    use lazy_static::lazy_static;
    use scraper::{Html, Selector};
    use serde::{Deserialize, Serialize};
    use std::collections::HashMap;

    lazy_static! {
        static ref CLIENT: reqwest::Client = reqwest::Client::new();
    }

    mod api_info {
        use super::*;

        #[derive(Serialize, Deserialize, Debug)]
        #[allow(non_snake_case)]
        pub struct ArtistInfoAPI {
            relatedArtistsIds: Vec<String>,
            pub OriginalArtistName: String,
            activeYearsCompletion: Option<i32>,
            activeYearsStart: Option<i32>,
            pub artistName: String,
            pub biography: Option<String>, // if empty then "", not null
            birthDay: String,              // weird format
            pub birthDayAsString: String,
            contentId: i64,
            deathDay: String, //weird format
            pub deathDayAsString: Option<String>,
            dictonaries: Vec<i32>,
            pub gender: String,
            pub image: String,
            lastNameFirst: Option<String>,
            periodsOfWork: String,
            series: String,
            story: Option<String>,
            themes: String,
            url: String,
            pub wikipediaUrl: Option<String>,
        }

        pub async fn fetch_artist_info(url: &String) -> Result<ArtistInfoAPI, reqwest::Error> {
            let url = format!("https://www.wikiart.org/en/{}?json=2", url);
            let info = CLIENT
                .get(&url)
                .send()
                .await?
                .json::<ArtistInfoAPI>()
                .await?;
            Ok(info)
        }
    }

    mod wiki_info {
        use super::*;

        #[derive(Serialize)]
        pub struct WikipediaBiography {
            data: String,
        }

        pub async fn fetch_wiki_info(url: &String) -> Result<Option<WikipediaBiography>, reqwest::Error> {
            let url = format!("https://www.wikiart.org/en/{}", url);
            let html = CLIENT.get(&url).send().await?.text().await?;
            let document = Html::parse_document(&html);
            let selector =
                Selector::parse("div.wiki-layout-artist-info-tab[id=info-tab-wikipediaArticle]")
                    .unwrap();
            let bio: Option<String> = document
                .select(&selector)
                .next()
                .map(|s|
                    s.select(&Selector::parse("p").unwrap())
                     .next()
                     .unwrap()
                     .text()
                     .collect()
                     );
            match bio {
                None => Ok(None),
                Some(bio) => Ok(Some(WikipediaBiography { data: bio })),
            }
        }
    }

    mod main_page_info {
        use super::*;

        #[derive(Serialize)]
        pub struct LinkName {
            url: String,
            name: String,
        }

        struct DataHolder {
            vecs: HashMap<String, Vec<String>>,
            strings: HashMap<String, String>,
            pair_vecs: HashMap<String, Vec<LinkName>>,
        }

        impl DataHolder {
            fn new() -> Self {
                DataHolder {
                    vecs: HashMap::new(),
                    strings: HashMap::new(),
                    pair_vecs: HashMap::new(),
                }
            }
        }

        pub struct MainPageInfo {
            pub active_years: Option<String>,
            pub nationality: Option<Vec<String>>,
            pub painting_school: Option<Vec<String>>,
            pub field: Option<Vec<String>>,
            pub art_movement: Option<Vec<LinkName>>, //url, name
            pub influenced_by: Option<Vec<LinkName>>, //url, name
            pub influenced_on: Option<Vec<LinkName>>, //url, name
        }

        impl MainPageInfo {
            fn new(mut data: DataHolder) -> Self {
                MainPageInfo {
                    active_years: data.strings.remove("Active Years:"),
                    nationality: data.vecs.remove("Nationality:"),
                    painting_school: data.vecs.remove("Painting School:"),
                    field: data.vecs.remove("Field:"),
                    art_movement: data.pair_vecs.remove("Art Movement:"),
                    influenced_by: data.pair_vecs.remove("Influenced by:"),
                    influenced_on: data.pair_vecs.remove("Influenced on:"),
                }
            }
        }

        pub async fn fetch_main_page_data(url: &String) -> reqwest::Result<MainPageInfo> {
            let url = format!("https://www.wikiart.org/en/{}", url);
            let html = CLIENT.get(&url).send().await?.text().await?;
            let document = Html::parse_document(&html);
            let s_selector = Selector::parse("li").unwrap();

            let children = document
                .select(&Selector::parse("article").unwrap())
                .next()
                .unwrap()
                .select(&Selector::parse("ul").unwrap())
                .next()
                .unwrap()
                .select(&s_selector);
            let data = parse_main_page_data(children);
            Ok(MainPageInfo::new(data))
        }

        fn parse_main_page_data(children: scraper::element_ref::Select) -> DataHolder {
            let pair_search = vec!["Active Years:"];
            let vec_search = vec!["Nationality:", "Painting School:", "Field:"];
            let link_search = vec!["Art Movement:", "Influenced by:", "Influenced on:"];
            let mut info = DataHolder::new();

            for c in children {
                let attr_name: Option<String> = c
                    .select(&Selector::parse("s").unwrap())
                    .next()
                    .map(|attr| attr.text().collect());
                if attr_name.is_none() {
                    continue;
                }
                let attr_name = attr_name.unwrap();

                if pair_search.contains(&attr_name.as_str()) {
                    let years = c.text().skip(2).next().unwrap().trim();
                    info.strings.insert(attr_name, years.to_string());
                } else if vec_search.contains(&attr_name.as_str()) {
                    let vals: Vec<String> = c
                        .text()
                        .collect::<String>()
                        .trim()
                        .trim_start_matches(&attr_name)
                        .split(",")
                        .map(|val| val.trim().to_string())
                        .collect();
                    info.vecs.insert(attr_name, vals);
                } else if link_search.contains(&attr_name.as_str()) {
                    let pairs: Vec<LinkName> = c
                        .select(&Selector::parse("a").unwrap())
                        .map(|a| {
                            let url_parts = a
                                .value()
                                .attr("href")
                                .unwrap()
                                .split("/")
                                .collect::<Vec<&str>>();
                            let url = match url_parts.len() {
                                3 => format!("artist/{}", url_parts[2]),
                                4 => format!("art_movement/{}", url_parts[3]),
                                _ => String::new(),
                            };
                            LinkName {
                                url,
                                name: a.text().collect::<String>(),
                            }
                        })
                        .collect();
                    info.pair_vecs.insert(attr_name, pairs);
                }
            }
            info
        }
    }

    #[derive(Serialize)]
    pub struct Artist {
        name: String,
        long_name: String,
        birth: String,
        death: Option<String>,
        active_years: Option<String>,
        nationality: Option<Vec<String>>,
        painting_school: Option<Vec<String>>,
        field: Option<Vec<String>>,
        art_movement: Option<Vec<main_page_info::LinkName>>, //url, name
        influenced_by: Option<Vec<main_page_info::LinkName>>, //url, name
        influenced_on: Option<Vec<main_page_info::LinkName>>, //url, name
        sex: String,
        image_url: String,
        biography: Option<String>,
        wiki_biography: Option<wiki_info::WikipediaBiography>,
        wiki_url: Option<String>,
    }

    impl Artist {
        pub fn new(
            info: api_info::ArtistInfoAPI,
            main_page: main_page_info::MainPageInfo,
            wiki_info: Option<wiki_info::WikipediaBiography>,
        ) -> Self {
            Artist {
                name: info.artistName,
                long_name: info.OriginalArtistName,
                birth: info.birthDayAsString,
                death: info.deathDayAsString,
                active_years: main_page.active_years,
                nationality: main_page.nationality,
                painting_school: main_page.painting_school,
                field: main_page.field,
                art_movement: main_page.art_movement,
                influenced_by: main_page.influenced_by,
                influenced_on: main_page.influenced_on,
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

    pub async fn fetch_data(
        url: &String,
    ) -> (
        reqwest::Result<api_info::ArtistInfoAPI>,
        reqwest::Result<main_page_info::MainPageInfo>,
        reqwest::Result<Option<wiki_info::WikipediaBiography>>,
    ) {
        let f1 = api_info::fetch_artist_info(url);
        let f2 = main_page_info::fetch_main_page_data(url);
        let f3 = wiki_info::fetch_wiki_info(url);
        futures::join!(f1, f2, f3)
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
    let (artist_info, main_page_data, wiki) = block_on(artist_info::fetch_data(&url));
    let artist_info = artist_info.unwrap();
    let main_page_data = main_page_data.unwrap();
    let wiki = wiki.unwrap();
    Json(artist_info::Artist::new(artist_info, main_page_data, wiki))
}

#[get("/artist/<url>/paintings")]
pub fn artist_paintings(url: String) -> Json<Vec<paintings::PaintingShortInfoAPI>> {
    Json(paintings::fetch_paintings(&url).unwrap())
}
