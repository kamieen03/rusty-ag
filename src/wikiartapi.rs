use serde::Deserialize;

#[derive(Deserialize)]
#[allow(non_snake_case)]
#[allow(dead_code)]
struct LoginResponse {
    SessionKey: String,
    MaxRequestsPerHour: i32,
    MaxSessionsPerHour: i32,
}

pub fn login() -> Result<String, reqwest::Error>{
    let json: LoginResponse = reqwest::blocking::get(api_url)?.json()?;
    Ok(json.SessionKey)
}
