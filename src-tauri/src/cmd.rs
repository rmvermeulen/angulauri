use serde::Deserialize;

#[derive(Deserialize, Debug)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  GetItems {
    id: String,
    page: usize,
    page_size: usize,
    callback: String,
    error: String,
  },
  CreateResource {
    items: Vec<String>,
    callback: String,
    error: String,
  },
  ListResources {
    callback: String,
    error: String,
  },
}
