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
  fn execute_command(&self, _webview: &mut Webview, command: cmd::Cmd) {
    match command {
      GetItems {
        id,
        page,
        page_size,
        callback,
        error,
      } => {
        let response = self.get_items(&id, page, page_size);
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
  }

  fn get_items(&self, id: &str, page: usize, page_size: usize) -> anyhow::Result<GetItemsResponse> {
    let id = Uuid::parse_str(&id).map_err(|e| anyhow!("Uuid {}", e))?;

    let db = self
      .database
      .lock()
      .map_err(|e| anyhow!("Database {}", e))?;

    let result = match db.get(&id) {
      Some(items) => {
        let total_item_count = items.len();
        let page_start = page * page_size;
        if page_start > total_item_count {
          Ok(GetItemsResponse {
            items: vec![],
            has_prev: false,
            has_next: false,
          })
        } else if page_start == total_item_count {
          Ok(GetItemsResponse {
            items: vec![],
            has_prev: true,
            has_next: false,
          })
        } else {
          use std::cmp::min;
          let page_start = min(page * page_size, total_item_count - 1);
          let page_end = min(page_start + page_size, total_item_count);

          let selected_items = &items[page_start..page_end];
          let results: Vec<String> = selected_items.into();
          Ok(GetItemsResponse {
            items: results,
            has_prev: page_start > 0 && page_start <= total_item_count,
            has_next: page_end < total_item_count,
          })
        }
      }
      None => Err(anyhow!("No entry for that id")),
    };

    result
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
    .invoke_handler(move |webview, json| match serde_json::from_str(json) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        app.execute_command(webview, command);
        Ok(())
      }
    })
    .build()
    .run();
}

#[cfg(test)]
mod tests {
  // Note this useful idiom: importing names from outer (for mod tests) scope.
  use super::*;
  fn create_app() -> (AppData, String) {
    let id = Uuid::new_v4();
    let mut database = HashMap::new();
    database.insert(id, (0..20).map(|i| i.to_string()).collect());
    let app = AppData {
      database: create_handle(database),
    };
    (app, id.to_string())
  }
  #[test]
  fn test_get_items() {
    let (app, id) = create_app();
    println!("test database: {:?}", app);

    let res = app.get_items(&id, 0, 3).unwrap();
    assert_eq!(res.items, vec!["0", "1", "2"], "Items from the start");
    assert_eq!(res.has_next, true, "Next page available");
    assert_eq!(res.has_prev, false, "Previous page NOT available");

    let res = app.get_items(&id, 3, 3).unwrap();
    assert_eq!(res.items, vec!["9", "10", "11"], "Items from the middle");
    assert_eq!(res.has_next, true, "Next page available");
    assert_eq!(res.has_prev, true, "Previous page available");

    let res = app.get_items(&id, 6, 3).unwrap();
    assert_eq!(res.items, vec!["18", "19"], "Items from the end");
    assert_eq!(res.has_next, false, "Next page NOT available");
    assert_eq!(res.has_prev, true, "Previous page available");

    let res = app.get_items(&id, 10, 3).unwrap();
    assert!(res.items.is_empty(), "No items at this point");
    assert_eq!(res.has_next, false, "Next page NOT available");
    assert_eq!(res.has_prev, false, "Previous page NOT available");
  }
  #[test]
  fn test_get_items_invalid_id() {
    let (app, _) = create_app();
    let e = app
      .get_items("some invalid id", 50, 3)
      .expect_err("id is not valid UUID, should have failed");
    assert_eq!(e.to_string().find("Uuid invalid length"), Some(0));
  }
}
