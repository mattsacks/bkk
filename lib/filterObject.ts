export function filterObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string | number | symbol, any>,
  Val extends T[keyof T]
>(obj: T, filter: (key: keyof T, val: Val) => boolean) {
  const filteredObject: Partial<T> = {};

  for (const [key, val] of Object.entries(obj)) {
    if (Object.hasOwn(obj, key) && filter(key, val)) {
      filteredObject[key as keyof T] = val;
    }
  }

  return filteredObject;
}
