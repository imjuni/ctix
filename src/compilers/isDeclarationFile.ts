import { isDeclaration } from '#/compilers/isDeclaration';
import type * as tsm from 'ts-morph';

export function isDeclarationFile(sourceFile: tsm.SourceFile) {
  const statements = sourceFile.getStatements().map((child) => {
    return {
      kind: child.getKind(),
      kindName: child.getKindName(),
      text: child.getText(),
      isDeclaration: isDeclaration(child.getKind()),
    };
  });

  return statements.every((statement) => statement.isDeclaration);
}
