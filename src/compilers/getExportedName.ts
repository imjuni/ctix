import { getRefinedFilename } from '#/tools/getRefinedFilename';
import path from 'path';
import * as tsm from 'ts-morph';

export function getExportedName(exportedDeclarationNode: tsm.ExportedDeclarations): string {
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

  // ObjectLiteralExpression
  // eg. export { Button, Text, Accordion };
  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.ObjectLiteralExpression) != null) {
    const objectLiteralExpressionNode = exportedDeclarationNode.asKindOrThrow(
      tsm.SyntaxKind.ObjectLiteralExpression,
    );

    const sourceFile = objectLiteralExpressionNode.getSourceFile();
    const filename = sourceFile.getBaseName();
    const basename = getRefinedFilename(filename);
    return basename;
  }

  // BindingElement
  // eg. export const { Button, Text, Accordion } = CoreModule;
  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.BindingElement) != null) {
    const bindingElementNode = exportedDeclarationNode.asKindOrThrow(tsm.SyntaxKind.BindingElement);
    return bindingElementNode.getName();
  }

  // CallExpression
  // eg. export default withTheme()(ReactComponent);
  // CallExpression don't have name and only working non-named-export
  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.CallExpression) != null) {
    const callExpression = exportedDeclarationNode.asKindOrThrow(tsm.SyntaxKind.CallExpression);

    const name = callExpression.getSymbol()?.getEscapedName();

    if (name == null) {
      const sourceFile = callExpression.getSourceFile();
      const filename = sourceFile.getBaseName();
      const basename = getRefinedFilename(filename);
      return basename;
    }

    return name;
  }

  // NewExpression
  // eg. export default new MyComponent();
  // NewExpression don't have name and only working non-named-export
  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.NewExpression) != null) {
    const newExpression = exportedDeclarationNode.asKindOrThrow(tsm.SyntaxKind.NewExpression);

    const name = newExpression.getSymbol()?.getEscapedName();

    if (name == null) {
      const sourceFile = newExpression.getSourceFile();
      const filename = sourceFile.getBaseName();
      const basename = getRefinedFilename(filename);
      return basename;
    }

    return name;
  }

  // SourceFile(like Vue.js components)
  // eg.
  //
  // ```ts
  // /// <reference path="../types/vue.d.ts" />
  // import Foo from './Foo.vue';
  // export { Foo };
  // ```
  if (exportedDeclarationNode.asKind(tsm.SyntaxKind.SourceFile) != null) {
    const newExpression = exportedDeclarationNode.asKindOrThrow(tsm.SyntaxKind.SourceFile);
    const name = path.basename(newExpression.getFilePath().toString());
    return name;
  }

  throw new Error(
    `Cannot support type: (${exportedDeclarationNode.getKind()}) ${exportedDeclarationNode.getText()}`,
  );
}
