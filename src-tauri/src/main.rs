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
            ListFiles {
              path,
              callback,
              error,
            } => {
              //  your command code
              println!("path {}", path);
            }
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}
