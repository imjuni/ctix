import { isNotEmpty } from 'my-easy-fp';
import * as tsm from 'ts-morph';

export default function getIsIsolatedModules(
  ...exportedDeclarationNodes: tsm.ExportedDeclarations[]
): boolean {
  return exportedDeclarationNodes
    .map((exportedDeclarationNode) => {
      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.ClassDeclaration))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.VariableDeclaration))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.ArrowFunction))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.FunctionDeclaration))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.InterfaceDeclaration))) {
        return true;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.TypeAliasDeclaration))) {
        return true;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.EnumDeclaration))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.ModuleDeclaration))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.ArrayLiteralExpression))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.ObjectLiteralExpression))) {
        return false;
      }

      if (isNotEmpty(exportedDeclarationNode.asKind(tsm.SyntaxKind.BindingElement))) {
        return false;
      }

      throw new Error(
        `Cannot support type: (${exportedDeclarationNode.getKind()}) ${exportedDeclarationNode.getText()}`,
      );
    })
    .some(Boolean);
}
