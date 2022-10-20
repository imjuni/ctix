import getRefinedFilename from '@tools/getRefinedFilename';
import * as tsm from 'ts-morph';

export default function getExportedName(exportedDeclarationNode: tsm.ExportedDeclarations): string {
  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ClassDeclaration) != null) {
    const classDeclarationNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.ClassDeclaration,
    );

    return classDeclarationNode.getNameOrThrow().toString();
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.VariableDeclaration) != null) {
    const variableDeclarationNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.VariableDeclaration,
    );
    return variableDeclarationNode.getName();
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ArrowFunction) != null) {
    const arrowFunctionNode = exportedDeclarationNode.asKindOrThrow(tsm.SyntaxKind.ArrowFunction);
    const name = arrowFunctionNode.getSymbolOrThrow().getEscapedName();

    if (name === '__function') {
      const sourceFile = arrowFunctionNode.getSourceFile();
      const filename = sourceFile.getBaseName();
      const basename = getRefinedFilename(filename);
      return basename;
    }
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.FunctionDeclaration) != null) {
    const functionDeclarationNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.FunctionDeclaration,
    );

    const name = functionDeclarationNode.getName();

    if (name == null) {
      const sourceFile = functionDeclarationNode.getSourceFile();
      const filename = sourceFile.getBaseName();
      const basename = getRefinedFilename(filename);
      return basename;
    }

    return functionDeclarationNode.getNameOrThrow().toString();
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.InterfaceDeclaration) != null) {
    const interfaceDeclarationNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.InterfaceDeclaration,
    );
    return interfaceDeclarationNode.getName();
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.TypeAliasDeclaration) != null) {
    const typeAliasDeclarationNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.TypeAliasDeclaration,
    );
    return typeAliasDeclarationNode.getName();
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.EnumDeclaration) != null) {
    const enumDeclarationNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.EnumDeclaration,
    );
    return enumDeclarationNode.getName();
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ModuleDeclaration) != null) {
    const moduleDeclarationNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.ModuleDeclaration,
    );
    return moduleDeclarationNode.getName();
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ArrayLiteralExpression) != null) {
    const arrayLiteralExpressionNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.ArrayLiteralExpression,
    );

    const sourceFile = arrayLiteralExpressionNode.getSourceFile();
    const filename = sourceFile.getBaseName();
    const basename = getRefinedFilename(filename);
    return basename;
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ObjectLiteralExpression) != null) {
    const objectLiteralExpressionNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.ObjectLiteralExpression,
    );

    const sourceFile = objectLiteralExpressionNode.getSourceFile();
    const filename = sourceFile.getBaseName();
    const basename = getRefinedFilename(filename);
    return basename;
  }

  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.BindingElement) != null) {
    const bindingElementNode = exportedDeclarationNode.asKindOrThrow(tsm.SyntaxKind.BindingElement);
    return bindingElementNode.getName();
  }

  throw new Error(
    `Cannot support type: (${exportedDeclarationNode.getKind()}) ${exportedDeclarationNode.getText()}`,
  );
}
