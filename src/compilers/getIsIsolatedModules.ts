import * as tsm from 'ts-morph';

export default function getIsIsolatedModules(
  ...exportedDeclarationNodes: tsm.ExportedDeclarations[]
): boolean {
  return exportedDeclarationNodes
    .map((exportedDeclarationNode) => {
      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ClassDeclaration) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.VariableDeclaration) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ArrowFunction) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.FunctionDeclaration) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.InterfaceDeclaration) != null) {
        return true;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.TypeAliasDeclaration) != null) {
        return true;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.EnumDeclaration) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ModuleDeclaration) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ArrayLiteralExpression) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ObjectLiteralExpression) != null) {
        return false;
      }

      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.BindingElement) != null) {
        return false;
      }

      throw new Error(
        `Cannot support type: (${exportedDeclarationNode.getKind()}) ${exportedDeclarationNode.getText()}`,
      );
    })
    .some(Boolean);
}
