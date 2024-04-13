import * as tsm from 'ts-morph';

const declarationKindMap: Map<tsm.SyntaxKind, boolean> = new Map([
  [tsm.SyntaxKind.ImportDeclaration, true],
  [tsm.SyntaxKind.ModuleDeclaration, true],
]);

export function isDeclarationFile(sourceFile: tsm.SourceFile) {
  const statements = sourceFile.getStatements().map((child) => {
    return {
      kind: child.getKind(),
      kindName: child.getKindName(),
      text: child.getText(),
      isDeclaration: declarationKindMap.get(child.getKind()) ?? false,
    };
  });

  return statements.every((statement) => statement.isDeclaration);
}
