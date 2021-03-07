#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use serde;
use tauri;
use uuid;
mod cmd;

#[derive(serde::Serialize)]
struct GetItemsResponse {
  items: Vec<String>,
  has_prev: bool,
  has_next: bool,
}

fn main() {
  use std::collections::HashMap;
  use uuid::Uuid;
  let database: HashMap<Uuid, Vec<String>> = HashMap::new();
  let items: Vec<i32> = (0..100).collect();

  tauri::AppBuilder::new()
    .invoke_handler(move |_webview, arg| {
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
              println!("CreateResource with {:?}", items);
              tauri::execute_promise(_webview, move || Ok("new-uuid"), callback, error);
            }
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}
