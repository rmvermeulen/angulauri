import { Injectable } from '@angular/core'
import { promisified } from 'tauri/api/tauri'

export type Cmd =
  | { cmd: 'getCwd' }
  | { cmd: 'getItems'; id: string; page: number; page_size: number }
  | { cmd: 'createResource'; items: string[] }

export interface GetItemsResponse<T> {
  items: T[]
  hasPrev: boolean
  hasNext: boolean
}

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  constructor() {}

  async getCwd(): Promise<string> {
    return this.cmd<string>({ cmd: 'getCwd' })
  }
  async getItems<T = string>(
    id: string,
    page = 0,
    page_size = 10
  ): Promise<GetItemsResponse<T>> {
    return this.cmd({ cmd: 'getItems', id, page, page_size })
  }

  async createResource(items: string[]): Promise<string> {
    return this.cmd<string>({ cmd: 'createResource', items })
  }

  private async cmd<R>(cmd: Cmd): Promise<R> {
    return promisified(cmd)
  }
}
