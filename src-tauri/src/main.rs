#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod app;
mod cmd;

use app::{App, Database};
use tauri::AppBuilder;
use uuid::Uuid;

fn main() {
  let mut database = Database::new();
  database.insert(
    Uuid::new_v4(),
    (0..100).map(|n| n.to_string()).collect::<Vec<_>>(),
  );

  let app = App::new(database);

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
