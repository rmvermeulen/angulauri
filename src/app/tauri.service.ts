import { Injectable } from '@angular/core'
import { camelCase } from 'camel-case'
import * as joi from 'joi'
import { snakeCase } from 'snake-case'
import { promisified } from 'tauri/api/tauri'

export type Cmd = 'getItems' | 'listResources' | 'createResource'
export type Args<T extends Cmd, R = any> = T extends 'getItems'
  ? { cmd: 'getItems'; id: string; page: number; pageSize: number }
  : T extends 'listResources'
  ? { cmd: 'listResources' }
  : T extends 'createResource'
  ? { cmd: 'createResource'; items: R[] }
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
    getItems: joi.object({
      items: joi.array().required().items(joi.string()),
      hasNext: joi.bool().required(),
      hasPrev: joi.bool().required(),
    }),
  }

  constructor() {}

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

  private async cmd<C extends Cmd>(cmd: Args<C>): Promise<Response<C>> {
    return promisified(toRust(cmd))
  }

  private validate<T extends Response<Cmd>>(schema: joi.Schema) {
    return (obj: any) => joi.attempt(fromRust(obj), schema) as T
  }
}
