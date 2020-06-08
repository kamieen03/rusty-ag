#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket::response::NamedFile;
use std::path::Path;

mod artist;
mod artwork;
mod movement;
mod popular;
mod react_routes;
mod search;
mod wikiartapi;

#[get("/", format = "html")]
fn index() -> Option<NamedFile> {
    NamedFile::open(Path::new("static/build/index.html")).ok()
}

fn main() {
    let react_routes = routes![
        index,
        react_routes::manifest,
        react_routes::js_files,
        react_routes::css_files,
        react_routes::logo192,
        react_routes::logo512,
    ];
    let api_routes = routes![
        search::search,
        artist::artist,
        artist::artist_paintings,
        artwork::artwork_v1,
        artwork::artwork_v2,
        movement::movement,
        popular::popular_paintings,
    ];
    rocket::ignite()
        .mount("/", react_routes)
        .mount("/api/", api_routes)
        .launch();
}
