module.exports = {
  "src/*.{js,ts}": [
    "ng lint --fix --lint-file-patterns",
    // "ng test --include",
  ],
  "src-tauri/*": ["cargo test"],
};
