export const isServer = (): boolean => {
  return typeof window === undefined;
};

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

export const isArray = <T = unknown>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isEmpty = (value: unknown): boolean => {
  if (isNullish(value)) return true;
  if (isString(value)) return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

export const isNullish = (value: unknown): value is null | undefined => {
  return isNull(value) || isUndefined(value);
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const hasProperty = <T extends object>(
  obj: T,
  prop: keyof any
): prop is keyof T => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const isOneOf = <T extends readonly unknown[]>(
  value: unknown,
  array: T
): value is T[number] => {
  return array.includes(value);
};
