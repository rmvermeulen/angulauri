import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  constructor() {}

  async getCwd(): Promise<string> {
    return 'tauri:dir';
  }
}
