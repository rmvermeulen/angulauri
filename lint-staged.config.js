// @ts-check
const { pipe, test, partition } = require('ramda')

module.exports = {
  'src/**/*.{js,ts}': [
    'prettier --write',
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
