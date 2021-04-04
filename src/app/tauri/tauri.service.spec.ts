jest.mock('tauri/api/tauri')

import { TestBed } from '@angular/core/testing'
import { fromRust, TauriService, toRust } from './tauri.service'
import { promisified } from 'tauri/api/tauri'

describe('Data transformers', () => {
  test('fromRust (make keys camelCase)', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    expect(fromRust({ multi_word_key: null })).toEqual({ multiWordKey: null })
  })
  test('toRust (make keys snake_case)', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    expect(toRust({ multiWordKey: null })).toEqual({ multi_word_key: null })
  })
  test('both ways', () => {
    const js = { keyUsingCamelCase: true }
    expect(toRust(js)).not.toEqual(js)
    expect(fromRust(toRust(js))).toEqual(js)

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const rust = { key_using_snake_case: true }
    expect(fromRust(rust)).not.toEqual(rust)
    expect(toRust(fromRust(rust))).toEqual(rust)
  })
})

describe('TauriService', () => {
  let service: TauriService

  beforeAll(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TauriService)
  })

  beforeEach(() => {
    ;(promisified as jest.Mock).mockClear()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('fetches items by id', async () => {
    expect(promisified).not.toHaveBeenCalled()
    await expect(service.getItems('some uuid')).rejects.toMatchInlineSnapshot(
      `[ValidationError: "items" is required]`,
    )
    expect(promisified).toHaveBeenCalledWith({
      cmd: 'getItems',
      id: 'some uuid',
      page: 0,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_size: 10,
    })
  })
  it('fetches items by id with page options', async () => {
    expect(promisified).not.toHaveBeenCalled()
    await expect(
      service.getItems('some uuid', 5, 12),
    ).rejects.toMatchInlineSnapshot(`[ValidationError: "items" is required]`)
    expect(promisified).toHaveBeenCalledWith({
      cmd: 'getItems',
      id: 'some uuid',
      page: 5,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_size: 12,
    })
  })
  it('creates a resource from a list of items', async () => {
    expect(promisified).not.toHaveBeenCalled()
    await expect(
      service.createResource([1, 2, 3]),
    ).rejects.toMatchInlineSnapshot(`[ValidationError: "id" is required]`)
    expect(promisified).toHaveBeenCalledWith({
      cmd: 'createResource',
      items: [1, 2, 3],
    })
  })
  it('lists availlable resources', async () => {
    expect(promisified).not.toHaveBeenCalled()
    await expect(service.listResources()).rejects.toMatchInlineSnapshot(
      `[ValidationError: "ids" is required]`,
    )
    expect(promisified).toHaveBeenCalledWith({ cmd: 'listResources' })
  })
})
