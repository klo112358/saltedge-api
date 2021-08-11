export function pick<T extends Record<keyof any, any>, K extends keyof T>(
  v: T,
  keys: K[],
): Omit<T, K> {
  const result: any = {}
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(v, k)) {
      result[k] = v[k]
    }
  }
  return result
}

export function omit<T extends Record<keyof any, any>, K extends keyof T>(
  v: T,
  keys: K[],
): Omit<T, K> {
  const result: any = { ...v }
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(v, k)) {
      delete result[k]
    }
  }
  return result
}
