export type error = {
  code: string | null,
  message: string|null
}

export interface ApiResult<T>{
  data:T|null,
  errors:error[]|null
}
