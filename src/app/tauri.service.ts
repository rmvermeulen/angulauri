import { Injectable } from '@angular/core';
import { promisified } from 'tauri/api/tauri';

type Cmd = 'getCwd';

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  constructor() {}

  async getCwd(): Promise<string> {
    return this.cmd('getCwd').then(String);
    return 'tauri:dir';
  }

  private async cmd(cmd: Cmd, args?: {}) {
    return promisified({ cmd, ...args });
  }
}
