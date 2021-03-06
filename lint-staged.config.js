module.exports = {
  "src/**/*.{js,ts}": [
    // (files) => `ng lint --fix --lint-file-patterns=${files.join(",")}`,
    (_) => "ng lint --fix",
    "jest --findRelatedTests",
  ],
  "src-tauri/**/*": ["cargo test"],
};
