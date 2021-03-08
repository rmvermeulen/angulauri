#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use anyhow::{anyhow, Result};
use serde;
use std::sync::Arc;
use std::sync::Mutex;
use uuid::Uuid;
mod cmd;

#[derive(serde::Serialize)]
struct GetItemsResponse {
  items: Vec<String>,
  has_prev: bool,
  has_next: bool,
}
#[derive(serde::Serialize)]
struct CreateResourceResponse {
  id: Uuid,
}
#[derive(serde::Serialize)]
struct ListResourcesResponse {
  ids: Vec<Uuid>,
}

fn main() {
  use std::collections::HashMap;
  let database = Arc::new(Mutex::new(HashMap::<Uuid, Vec<String>>::new()));
  let items: Vec<i32> = (0..100).collect();

  tauri::AppBuilder::new()
    .invoke_handler(move |_webview, arg| {
      let database = database.clone();
      use cmd::Cmd::*;
      match serde_json::from_str(arg) {
        Err(e) => Err(e.to_string()),
        Ok(command) => {
          match command {
            // definitions for your custom commands from Cmd here
            GetCwd { callback, error } => {
              tauri::execute_promise(_webview, move || Ok("rust:cwd"), callback, error)
            }

            GetItems {
              id,
              page,
              page_size,
              callback,
              error,
            } => {
              //  your command code
              println!("getItems for '{}'", id);
              use std::cmp::min;
              let total_item_count = items.len();
              let page_start = min(page * page_size, total_item_count - 1);
              let page_end = min(page_start + page_size, total_item_count - 1);
              let selected_items = &items[page_start..page_end];
              let results: Vec<i32> = selected_items.into();
              tauri::execute_promise(
                _webview,
                move || {
                  Ok(GetItemsResponse {
                    items: results.iter().map(|n| n.to_string()).collect(),
                    has_prev: page_start > 0,
                    has_next: page_end < total_item_count,
                  })
                },
                callback,
                error,
              );
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
              tauri::execute_promise(_webview, move || response, callback, error);
            }
            ListResources { callback, error } => {
              let response = database
                .lock()
                .map(|db| ListResourcesResponse {
                  ids: db.keys().copied().collect(),
                })
                .map_err(|err| anyhow!("DB access: {}", err));
              tauri::execute_promise(_webview, move || response, callback, error)
            }
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}
