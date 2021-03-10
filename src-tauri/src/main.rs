#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use anyhow::anyhow;
use serde::Serialize;
use std::collections::HashMap;
use std::result::Result;
use std::sync::Arc;
use std::sync::Mutex;
use tauri::{execute_promise, AppBuilder, Webview};
use uuid::Uuid;
mod cmd;
use cmd::Cmd::*;

type Database = HashMap<Uuid, Vec<String>>;
type Handle<T> = Arc<Mutex<T>>;

fn create_handle<T>(value: T) -> Handle<T> {
  Arc::new(Mutex::new(value))
}

#[derive(Serialize, Debug)]
struct GetItemsResponse {
  items: Vec<String>,
  has_prev: bool,
  has_next: bool,
}

#[derive(Serialize, Debug)]
struct CreateResourceResponse {
  id: Uuid,
}

#[derive(Serialize, Debug)]
struct ListResourcesResponse {
  ids: Vec<Uuid>,
}

#[derive(Debug)]
struct AppData {
  database: Handle<Database>,
}

impl AppData {
  fn invoke_handler(&self, _webview: &mut Webview, arg: &str) -> Result<(), String> {
    match serde_json::from_str(arg) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        match command {
          GetItems {
            id,
            page,
            page_size,
            callback,
            error,
          } => {
            let response = self.get_items(id, page, page_size);
            execute_promise(_webview, move || response, callback, error);
          }
          CreateResource {
            items,
            callback,
            error,
          } => {
            let response = self.create_resource(items);
            execute_promise(_webview, move || response, callback, error);
          }
          ListResources { callback, error } => {
            let response = self.list_resources();
            execute_promise(_webview, move || response, callback, error)
          }
        }
        Ok(())
      }
    }
  }
  fn get_items(
    &self,
    id: String,
    page: usize,
    page_size: usize,
  ) -> anyhow::Result<GetItemsResponse> {
    Uuid::parse_str(&id)
      .map_err(|e| anyhow!("Uuid {}", e))
      .and_then(|id| {
        self
          .database
          .lock()
          .map_err(|e| anyhow!("Database {}", e))
          .map(|db| match db.get(&id) {
            Some(items) => {
              use std::cmp::min;
              let total_item_count = items.len();
              let page_start = min(page * page_size, total_item_count - 1);
              let page_end = min(page_start + page_size, total_item_count - 1);
              let selected_items = &items[page_start..page_end];
              let results: Vec<String> = selected_items.into();
              Ok(GetItemsResponse {
                items: results,
                has_prev: page_start > 0,
                has_next: page_end < total_item_count,
              })
            }
            None => Err(anyhow!("No entry for that id")),
          })
      })
      .and_then(|a| a)
  }
  fn create_resource(&self, items: Vec<String>) -> anyhow::Result<CreateResourceResponse> {
    let id = Uuid::new_v4();
    println!("CreateResource with {}@{:?}", id, items);
    self
      .database
      .lock()
      .map(|mut db| {
        db.insert(id, items);
        CreateResourceResponse { id }
      })
      .map_err(|err| anyhow!("DB access: {}", err))
  }
  fn list_resources(&self) -> anyhow::Result<ListResourcesResponse> {
    self
      .database
      .lock()
      .map(|db| ListResourcesResponse {
        ids: db.keys().copied().collect(),
      })
      .map_err(|err| anyhow!("DB access: {}", err))
  }
}

fn main() {
  let mut database = Database::new();
  database.insert(
    Uuid::new_v4(),
    (0..100).map(|n| n.to_string()).collect::<Vec<_>>(),
  );

  let app = AppData {
    database: create_handle(database),
  };

  AppBuilder::new()
    .invoke_handler(move |webview, json| app.invoke_handler(webview, json))
    .build()
    .run();
}

#[cfg(test)]
mod tests {
  // Note this useful idiom: importing names from outer (for mod tests) scope.
  use super::*;

  #[test]
  fn test_cmd() {
    assert_eq!((), ());
  }
}
