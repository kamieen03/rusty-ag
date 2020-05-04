#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

mod wikiartapi;
mod search;
mod artist;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}

fn main() {
    //let key = wikiartapi::login().unwrap();
    rocket::ignite().mount("/", routes![hello, search::search, artist::artist]).launch();
}
