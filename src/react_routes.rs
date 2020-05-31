use rocket::response::NamedFile;
use std::path::Path;
use std::path::PathBuf;

#[get("/static/js/<file..>")]
pub fn js_files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/build/static/js/").join(file)).ok()
}

#[get("/static/css/<file..>")]
pub fn css_files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/build/static/css/").join(file)).ok()
}

#[get("/manifest.json")]
pub fn manifest() -> Option<NamedFile> {
    NamedFile::open(Path::new("static/build/manifest.json")).ok()
}

#[get("/logo192.png")]
pub fn logo192() -> Option<NamedFile> {
    NamedFile::open(Path::new("static/build/logo192.png")).ok()
}

#[get("/logo512.png")]
pub fn logo512() -> Option<NamedFile> {
    NamedFile::open(Path::new("static/build/logo512.png")).ok()
}
