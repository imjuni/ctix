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

      // BindingElement
      // eg. export const { Button, Text, Accordion } = CoreModule;
      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.BindingElement) != null) {
        return false;
      }

      // CallExpression
      // eg. export default withTheme()(ReactComponent);
      // CallExpression don't have name and only working non-named-export
      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.CallExpression) != null) {
        return true;
      }

      // NewExpression
      // eg. export default new MyComponent();
      // NewExpression don't have name and only working non-named-export
      if (exportedDeclarationNode.asKind(tsm.SyntaxKind.NewExpression) != null) {
        return true;
      }

      // SourceFile(like Vue.js components)
      // eg.
      //
      // ```ts
      // /// <reference path="../types/vue.d.ts" />
      // import Foo from './Foo.vue';
      // export { Foo };
      // ```
      if (exportedDeclarationNode.getKind() === tsm.SyntaxKind.SourceFile) {
        return false;
      }

      throw new Error(
        `Cannot support type: (${exportedDeclarationNode.getKind()}) ${exportedDeclarationNode.getText()}`,
      );
    })
    .some(Boolean);
}
