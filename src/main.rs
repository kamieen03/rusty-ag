#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

mod wikiartapi;
mod search;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}


fn main() {
    let key = wikiartapi::login().unwrap();
    println!("{:?}", search::artist_map.len());
    rocket::ignite().mount("/", routes![hello, search::search]).launch();
}
