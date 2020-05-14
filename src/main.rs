#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod artist;
mod artwork;
mod search;
mod wikiartapi;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}

fn main() {
    let routes = routes![
        hello,
        search::search,
        artist::artist,
        artwork::artwork_v1,
        artwork::artwork_v2
    ];
    rocket::ignite().mount("/", routes).launch();
}
