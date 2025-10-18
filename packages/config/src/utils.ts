type ObjectType = object & { plugins: unknown[] } & Record<string, unknown | unknown[]>

const updateObject = <T extends Partial<ObjectType>>(obj: T, key: string, value: unknown | unknown[]) => {
  const result = obj

  if (key === 'plugins' && Array.isArray(value)) {
    result[key] = [...(result[key] || []), ...value]
  } else if (Array.isArray(value)) {
    const arrContent = [...(Array.isArray(result[key]) ? result[key] : [result[key]]), ...value]

    // @ts-expect-error type issue
    result[key] = result[key] ? [...new Set(arrContent)] : [...value]
  } else if (value && typeof value === 'object') {
    // @ts-expect-error type issue
    result[key] = result[key] ? deepMerge(result[key], value) : deepMerge({}, value)
  } else {
    // @ts-expect-error type issue
    result[key] = value
  }

  return result
}

export const deepMerge = <T extends Partial<ObjectType>>(...objs: T[]) => {
  let merged: T = {} as never

  for (const obj of objs) {
    if (!obj) continue

    for (const [key, value] of Object.entries(obj)) {
      merged = updateObject<T>(merged, key, value)
    }
  }

  return merged
}
