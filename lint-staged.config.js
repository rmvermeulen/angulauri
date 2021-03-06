module.exports = {
  "*.{js,ts,s?css}": [
    "ng lint --fix --lint-file-patterns",
    // "ng test --include",
  ],
  "src-tauri/*": ["cargo test"],
};
