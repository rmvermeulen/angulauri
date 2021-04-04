import { Injectable } from '@angular/core'
import { TauriService } from '../tauri/tauri.service'

const prop = <I, K extends keyof I>(p: K) => (record: I) => record[p]

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(private readonly tauri: TauriService) {}

  async create(data: number[]): Promise<string> {
    return this.tauri.createResource(data.map(String)).then(prop('id'))
  }

  async load(id: string): Promise<string[]> {
    return this.tauri.getItems(id).then(prop('items'))
  }

  async info(id: string) {
    return this.tauri.getInfo(id)
  }

  async list(): Promise<string[]> {
    return this.tauri.listResources().then(prop('ids'))
  }
}
