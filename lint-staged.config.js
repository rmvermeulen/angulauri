// @ts-check
const { pipe, test, partition } = require('ramda')

module.exports = {
  'src/**/*.{js,ts}': [
    // (files) => `ng lint --fix --lint-file-patterns=${files.join(",")}`,
    (_) => 'ng lint --fix',
    'jest --findRelatedTests',
  ],
  'src-tauri/**/*': [
    pipe(
      partition(test(/\.rs$/)),
      ([rsFiles, nonRsFiles]) =>
        `cd src-tauri && ${
          nonRsFiles.length
            ? // run all test tests
              'cargo test'
            : // run specific files only
              `cargo test ${rsFiles.join(',')}`
        }`,
    ),
  ],
}
