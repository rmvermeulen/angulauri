#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri;
mod cmd;

fn main() {
  tauri::AppBuilder::new()
    .invoke_handler(|_webview, arg| {
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
              page: _,
              page_size: _,
              callback,
              error,
            } => {
              //  your command code
              println!("getItems for '{}'", id);
              tauri::execute_promise(
                _webview,
                move || {
                  let items = vec![1, 2, 5];
                  Ok(items)
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
