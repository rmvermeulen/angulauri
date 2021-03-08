use serde::Deserialize;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  // your custom commands
  // multiple arguments are allowed
  // note that rename_all = "camelCase": you need to use "myCustomCommand" on JS
  GetCwd {
    callback: String,
    error: String,
  },
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
