#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

mod search;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}

fn main() {
    rocket::ignite().mount("/", routes![hello, search::search]).launch();
}
