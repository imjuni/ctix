import type { getExportedKind } from '#/compilers/getExportedKind';

export function getStatementAlias({
  alias,
  isDefault,
  filenamified,
  kind,
}: {
  alias?: string;
  filenamified: string;
  isDefault?: boolean;
  kind: ReturnType<typeof getExportedKind>;
}): string {
  if (isDefault && kind.name != null) {
    return kind.name;
  }

  if (alias != null) {
    return alias;
  }

  return filenamified;
}
