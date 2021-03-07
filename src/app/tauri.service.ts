import { Injectable } from '@angular/core';
import { snakeCase } from 'snake-case';
import { camelCase } from 'camel-case';
import { promisified } from 'tauri/api/tauri';

export type Cmd = 'getCwd' | 'getItems' | 'createResource';
export type Args<T extends Cmd, R = any> = T extends 'getCwd'
  ? { cmd: 'getCwd' }
  : T extends 'getItems'
  ? { cmd: 'getItems'; id: string; page: number; pageSize: number }
  : T extends 'createResource'
  ? { cmd: 'createResource'; items: R[] }
  : never;
export type Response<T extends Cmd, R = any> = T extends 'getCwd'
  ? GetCwdResponse
  : T extends 'getItems'
  ? GetItemsResponse<R>
  : T extends 'createResource'
  ? CreateResourceResponse
  : never;

export interface GetCwdResponse {
  cwd: string;
}
export interface CreateResourceResponse {
  id: string;
}
export interface GetItemsResponse<T> {
  items: T[];
  hasPrev: boolean;
  hasNext: boolean;
}

const mapKeys = (fn: (s: string) => string) => (o: Record<string, unknown>) => {
  const remapped = Object.entries(o).map(([k, v]: [string, unknown]) => [
    snakeCase(k),
    v,
  ]);
  return Object.fromEntries(remapped) as any;
};

const fromRust: <
  In extends Record<string, unknown>,
  Out extends Record<string, unknown> = In
>(
  o: In
) => Out = mapKeys(camelCase);

const toRust: <
  In extends Record<string, unknown>,
  Out extends Record<string, unknown> = In
>(
  o: In
) => Out = mapKeys(snakeCase);

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  constructor() {}

  async getCwd(): Promise<GetCwdResponse> {
    return this.cmd<'getCwd'>({ cmd: 'getCwd' });
  }
  async getItems<T = string>(
    id: string,
    page = 0,
    pageSize = 10
  ): Promise<GetItemsResponse<T>> {
    return this.cmd<'getItems'>({
      cmd: 'getItems',
      id,
      page,
      pageSize,
    });
  }

  async createResource<T>(items: T[]): Promise<CreateResourceResponse> {
    return this.cmd<'createResource'>({ cmd: 'createResource', items });
  }

  private async cmd<C extends Cmd>(cmd: Args<C>): Promise<Response<C>> {
    return promisified(toRust(cmd));
  }
}
