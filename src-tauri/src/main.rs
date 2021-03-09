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
type Database = HashMap<Uuid, Vec<String>>;
type Handle<T> = Arc<Mutex<T>>;

fn create_handle<T>(value: T) -> Handle<T> {
  Arc::new(Mutex::new(value))
}

fn main() {
  let mut database = Database::new();
  database.insert(
    Uuid::new_v4(),
    (0..100).map(|n| n.to_string()).collect::<Vec<_>>(),
  );

  let handler = invoke_handler(create_handle(database));
  AppBuilder::new().invoke_handler(handler).build().run();
}

type Handler = dyn FnMut(&mut Webview<'_>, &str) -> Result<(), String>;

fn invoke_handler(database: Handle<Database>) -> Box<Handler> {
  return Box::new(move |_webview, arg| {
    let database = database.clone();
    use cmd::Cmd::*;
    match serde_json::from_str(arg) {
      Err(e) => Err(e.to_string()),
      Ok(command) => {
        match command {
          // definitions for your custom commands from Cmd here
          GetCwd { callback, error } => {
            execute_promise(_webview, move || Ok("rust:cwd"), callback, error)
          }

          GetItems {
            id,
            page,
            page_size,
            callback,
            error,
          } => {
            let response = Uuid::parse_str(&id)
              .map_err(|e| anyhow!("Uuid {}", e))
              .and_then(|id| {
                database
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
              .and_then(|a| a);

            execute_promise(_webview, move || response, callback, error);
          }
          CreateResource {
            items,
            callback,
            error,
          } => {
            let id = Uuid::new_v4();
            println!("CreateResource with {}@{:?}", id, items);
            let response = database
              .lock()
              .map(|mut db| {
                db.insert(id, items);
                CreateResourceResponse { id }
              })
              .map_err(|err| anyhow!("DB access: {}", err));
            execute_promise(_webview, move || response, callback, error);
          }
          ListResources { callback, error } => {
            let response = database
              .lock()
              .map(|db| ListResourcesResponse {
                ids: db.keys().copied().collect(),
              })
              .map_err(|err| anyhow!("DB access: {}", err));
            execute_promise(_webview, move || response, callback, error)
          }
        }
        Ok(())
      }
    }
  });
}
