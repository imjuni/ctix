import * as tsm from 'ts-morph';

export function getFunctionName(kind: tsm.SyntaxKind, name?: string): string | undefined {
  if (kind === tsm.SyntaxKind.ArrowFunction) {
    if (name !== '__function' && name != null) {
      return name;
    }

    return undefined;
  }

  if (kind === tsm.SyntaxKind.FunctionDeclaration) {
    if (name != null) {
      return name;
    }

    return undefined;
  }

  return undefined;
}
