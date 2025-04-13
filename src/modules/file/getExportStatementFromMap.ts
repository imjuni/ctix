import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';

export function getExportStatementFromMap(
  key: string,
  map: Map<string, IExportStatement[]>,
): IExportStatement[] {
  const result = map.get(key) ?? [];
  return result;
}
