import { Injectable } from '@angular/core'
import { camelCase } from 'camel-case'
import * as joi from 'joi'
import { snakeCase } from 'snake-case'
import { promisified } from 'tauri/api/tauri'

export type Cmd =
  | 'getItems'
  | 'listResources'
  | 'getInfo'
  | 'createResource'
  | 'fsCmd'

export type FsCmd = 'readdir' | 'scanRepo'

export type Args<T extends Cmd, R = any> = T extends 'getItems'
  ? { cmd: 'getItems'; id: string; page: number; pageSize: number }
  : T extends 'listResources'
  ? { cmd: 'listResources' }
  : T extends 'getInfo'
  ? { cmd: 'getInfo'; id: string }
  : T extends 'createResource'
  ? { cmd: 'createResource'; items: R[] }
  : T extends 'fsCmd'
  ? { cmd: 'fsCmd'; fs: FsCmd; path: string }
  : never

export type Response<T extends Cmd, R = any> = T extends 'getItems'
  ? GetItemsResponse<R>
  : T extends 'listResources'
  ? ListResourcesResponse
  : T extends 'createResource'
  ? CreateResourceResponse
  : never

export interface GetCwdResponse {
  cwd: string
}
export interface CreateResourceResponse {
  id: string
}
export interface GetInfoResponse {
  id: string
  length: number
}
export interface ListResourcesResponse {
  ids: string[]
}
export interface GetItemsResponse<T> {
  items: T[]
  hasPrev: boolean
  hasNext: boolean
}

const mapKeys = (fn: (s: string) => string) => (o: Record<string, unknown>) => {
  const entries = Object.entries(o)
  const remapped = entries.map(([k, v]: [string, unknown]) => [fn(k), v])
  return Object.fromEntries(remapped) as any
}

export const fromRust: <
  In extends Record<string, unknown>,
  Out extends Record<string, unknown> = In
>(
  o: In,
) => Out = mapKeys(camelCase)

export const toRust: <
  In extends Record<string, unknown>,
  Out extends Record<string, unknown> = In
>(
  o: In,
) => Out = mapKeys(snakeCase)

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  private schemas = {
    listResources: joi.object({
      ids: joi.array().required().items(joi.string()),
    }),
    createResource: joi.object({
      id: joi.string().required(),
    }),
    getInfo: joi.object({
      id: joi.string().required(),
      length: joi.number().required(),
    }),
    getItems: joi.object({
      items: joi.array().required().items(joi.string()),
      hasNext: joi.bool().required(),
      hasPrev: joi.bool().required(),
    }),
  }

  constructor() {}
  fsCmd() {
    this.cmd({
      cmd: 'fsCmd',
      fs: 'readdir',
      path: '/',
    } as any)
      .then(console.log)
      .catch(console.error)
    this.cmd({
      cmd: 'fsCmd',
      fs: 'scanRepo',
      path: '/',
    } as any)
      .then(console.log)
      .catch(console.error)
  }
  async getItems<T = string>(
    id: string,
    page = 0,
    pageSize = 10,
  ): Promise<GetItemsResponse<T>> {
    return this.cmd<'getItems'>({
      cmd: 'getItems',
      id,
      page,
      pageSize,
    }).then(this.validate<GetItemsResponse<T>>(this.schemas.getItems))
  }

  async createResource<T>(items: T[]): Promise<CreateResourceResponse> {
    return this.cmd<'createResource'>({ cmd: 'createResource', items }).then(
      this.validate<CreateResourceResponse>(this.schemas.createResource),
    )
  }

  async listResources(): Promise<ListResourcesResponse> {
    return this.cmd<'listResources'>({ cmd: 'listResources' }).then(
      this.validate<ListResourcesResponse>(this.schemas.listResources),
    )
  }

  async getInfo(id: string): Promise<GetInfoResponse> {
    return this.cmd<'getInfo'>({ cmd: 'getInfo', id }).then(
      this.validate<GetInfoResponse>(this.schemas.getInfo),
    )
  }

  private async cmd<C extends Cmd>(cmd: Args<C>): Promise<Response<C>> {
    return promisified(toRust(cmd))
  }

  private validate<T extends Response<Cmd>>(schema: joi.Schema) {
    return (obj: any) => joi.attempt(fromRust(obj), schema) as T
  }
}