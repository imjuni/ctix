import { typeCheck } from 'type-check';

export function getCheckedValue<T>(types: string, value: unknown): T | undefined {
  const checked = typeCheck(types, value);

  if (checked) {
    return value as T;
  }

  return undefined;
}
