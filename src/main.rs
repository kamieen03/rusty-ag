#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

mod wikiartapi;
mod search;
mod artist;
mod artwork;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}

fn main() {
    rocket::ignite().mount("/", routes![hello, search::search, artist::artist, artwork::artwork]).launch();
}
