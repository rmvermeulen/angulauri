import { TestBed } from '@angular/core/testing';

import { TauriService } from './tauri.service';

describe('TauriService', () => {
  let service: TauriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TauriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches the current working directory', async () => {
    expect(await service.getCwd()).toEqual('');
  });
});
