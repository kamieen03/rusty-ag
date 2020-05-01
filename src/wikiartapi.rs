use std::collections::HashMap;
use serde::Deserialize;

#[derive(Deserialize)]
struct LoginResponse {
    SessionKey: String,
    MaxRequestsPerHour: i32,
    MaxSessionsPerHour: i32
}

pub fn login() -> Result<String, reqwest::Error>{
    let json: LoginResponse = reqwest::blocking::get(api_url)?.json()?;
    Ok(json.SessionKey)
}
