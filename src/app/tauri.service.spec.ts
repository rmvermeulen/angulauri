jest.mock('tauri/api/tauri')

import { TestBed } from '@angular/core/testing'
import { TauriService } from './tauri.service'
import { promisified } from 'tauri/api/tauri'

describe('TauriService', () => {
  let service: TauriService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TauriService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('fetches the current working directory', async () => {
    expect(promisified).not.toHaveBeenCalled()
    await service.getCwd()
    expect(promisified).toHaveBeenCalled()
  })
})
