use serde::Serialize;
use rocket_contrib::json::Json;


#[derive(Serialize)]
pub struct SearchData {
    artists: Vec<String>
}

#[get("/search/<query>")]
pub fn search(query: String) -> Json<SearchData> {
    Json(SearchData{artists: vec!["banksy".to_string()]})
}

