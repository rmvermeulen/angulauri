describe('asdasd', () => {
  test('require tauri', () => {
    expect(import('tauri/api/tauri')).resolves.toMatchInlineSnapshot(`
      Object {
        "invoke": [Function],
        "promisified": [Function],
        "transformCallback": [Function],
      }
    `)
  })
})
