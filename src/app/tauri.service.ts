import { Injectable } from '@angular/core';
import { promisified } from 'tauri/api/tauri';

type Cmd =
  | { cmd: 'getCwd' }
  | { cmd: 'getItems'; id: string; page: number; page_size: number }
  | { cmd: 'createResource'; items: string[] };

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  constructor() {}

  async getCwd(): Promise<string> {
    return this.cmd({ cmd: 'getCwd' }).then(String);
  }
  async getItems<T = string>(
    id: string,
    page = 0,
    page_size = 10
  ): Promise<T[]> {
    return this.cmd({ cmd: 'getItems', id, page, page_size }).then((items) => {
      if (items instanceof Array) {
        return items;
      }
      throw new Error(`Expected array, got ${typeof items}`);
    });
  }

  async createResource(items: string[]): Promise<string> {
    return this.cmd({ cmd: 'createResource', items }).then(String);
  }

  private async cmd(cmd: Cmd) {
    return promisified(cmd);
  }
}
