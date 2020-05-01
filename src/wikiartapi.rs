use std::collections::HashMap;
use serde::Deserialize;

#[derive(Deserialize)]
struct LoginResponse {
    SessionKey: String,
    MaxRequestsPerHour: i32,
    MaxSessionsPerHour: i32
}

pub fn login() -> Result<String, reqwest::Error>{
    let api_url = "https://www.wikiart.org/en/Api/2/login?accessCode=c8f58034b9cd4390&secretCode=a9a98fe8a1851e89";
    let json: LoginResponse = reqwest::blocking::get(api_url)?.json()?;
    Ok(json.SessionKey)
}
