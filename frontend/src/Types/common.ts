export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type Maybe<T> = T | null | undefined

export type ValueOf<T> = T[keyof T]

export type Awaitable<T> = T | Promise<T>

export type RequireFields<T, K extends keyof T> =
  Omit<T, K> & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> =
  Omit<T, K> & Partial<Pick<T, K>>