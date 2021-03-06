import { Injectable } from '@angular/core';
import { snakeCase } from 'snake-case';
import { promisified } from 'tauri/api/tauri';
export type Cmd =
  | { cmd: 'getCwd' }
  | { cmd: 'getItems'; id: string; page: number; pageSize: number }
  | { cmd: 'createResource'; items: string[] };

export interface GetItemsResponse<T> {
  items: T[];
  hasPrev: boolean;
  hasNext: boolean;
}

const rustifyObject: (o: Record<string, unknown>) => Record<string, unknown> = (
  o
) =>
  Object.fromEntries(
    Object.entries(o).map(([k, v]: [string, unknown]) => [snakeCase(k), v])
  );

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  constructor() {}

  async getCwd(): Promise<string> {
    return this.cmd<string>({ cmd: 'getCwd' });
  }
  async getItems<T = string>(
    id: string,
    page = 0,
    pageSize = 10
  ): Promise<GetItemsResponse<T>> {
    return this.cmd({ cmd: 'getItems', id, page, pageSize });
  }

  async createResource(items: string[]): Promise<string> {
    return this.cmd<string>({ cmd: 'createResource', items });
  }

  private async cmd<R>(cmd: Cmd): Promise<R> {
    return promisified(rustifyObject(cmd));
  }
}
