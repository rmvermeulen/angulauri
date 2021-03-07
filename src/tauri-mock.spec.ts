jest.mock('tauri/api/tauri')

import * as tauri from 'tauri/api/tauri'

describe('Tauri & Jest', () => {
  test('mocked tauri', () => {
    expect(tauri).toMatchInlineSnapshot(`
      Object {
        "__mocked__": true,
        "invoke": [MockFunction],
        "promisified": [MockFunction],
        "transformCallback": [MockFunction],
      }
    `)
  })
})
