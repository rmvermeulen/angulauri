#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri;
mod cmd;

fn main() {
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
              let page_start = page * page_size;
              let page_end = page_start + page_size;
              let selected_items = &items[page_start..page_end];
              let result: Vec<i32> = selected_items.into();
              tauri::execute_promise(_webview, move || Ok(result), callback, error);
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
