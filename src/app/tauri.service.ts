import { Injectable } from '@angular/core'
import { camelCase } from 'camel-case'
import * as joi from 'joi'
import { snakeCase } from 'snake-case'
import { promisified } from 'tauri/api/tauri'

export type Cmd = 'getCwd' | 'getItems' | 'listResources' | 'createResource'
export type Args<T extends Cmd, R = any> = T extends 'getCwd'
  ? { cmd: 'getCwd' }
  : T extends 'getItems'
  ? { cmd: 'getItems'; id: string; page: number; pageSize: number }
  : T extends 'listResources'
  ? { cmd: 'listResources' }
  : T extends 'createResource'
  ? { cmd: 'createResource'; items: R[] }
  : never
export type Response<T extends Cmd, R = any> = T extends 'getCwd'
  ? GetCwdResponse
  : T extends 'getItems'
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
  const remapped = Object.entries(o).map(([k, v]: [string, unknown]) => [
    snakeCase(k),
    v,
  ])
  return Object.fromEntries(remapped) as any
}

const fromRust: <
  In extends Record<string, unknown>,
  Out extends Record<string, unknown> = In
>(
  o: In,
) => Out = mapKeys(camelCase)

const toRust: <
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
      id: joi.string().required(),
    }),
  }

  constructor() {}

  async getCwd(): Promise<GetCwdResponse> {
    return this.cmd<'getCwd'>({ cmd: 'getCwd' })
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
    }).then(this.validate(this.schemas.getItems))
  }

  async createResource<T>(items: T[]): Promise<CreateResourceResponse> {
    return this.cmd<'createResource'>({ cmd: 'createResource', items }).then(
      this.validate(this.schemas.createResource),
    )
  }

  async listResources(): Promise<ListResourcesResponse> {
    return this.cmd<'listResources'>({ cmd: 'listResources' }).then(
      this.validate(this.schemas.listResources),
    )
  }

  private async cmd<C extends Cmd>(cmd: Args<C>): Promise<Response<C>> {
    return promisified(toRust(cmd))
  }

  private validate<T>(schema: joi.Schema) {
    return (obj: T) => joi.attempt(obj, schema) as T
  }
}
