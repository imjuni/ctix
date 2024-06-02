import * as tsm from 'ts-morph';

const declarationKindMap: Map<tsm.SyntaxKind, boolean> = new Map([
  [tsm.SyntaxKind.ImportDeclaration, true],
  [tsm.SyntaxKind.ModuleDeclaration, true],
]);

export function isDeclaration(statement: tsm.SyntaxKind) {
  const result = declarationKindMap.get(statement);

  if (result != null) {
    return result;
  }

  return false;
}
