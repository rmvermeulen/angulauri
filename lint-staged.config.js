module.exports = {
  "src/*.{js,ts}": [
    "ng lint --fix --lint-file-patterns",
    "jest --findRelatedTests",
  ],
  "src-tauri/*": ["cargo test"],
};
