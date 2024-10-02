import { getFunctionName } from '#/compilers/getFunctionName';
import { NotFoundExportedKind } from '#/errors/NotFoundExportedKind';
import * as tsm from 'ts-morph';
import { match } from 'ts-pattern';

export function getExportedKind(node: tsm.ExportedDeclarations): {
  name?: string;
  isPureType: boolean;
  kind: tsm.SyntaxKind;
} {
  const kind = node.getKind();

  return (
    match<
      tsm.SyntaxKind,
      {
        name?: string;
        isPureType: boolean;
        kind: tsm.SyntaxKind;
      }
    >(kind)
      .with(tsm.SyntaxKind.ClassDeclaration, () => {
        return {
          name: node.asKindOrThrow(tsm.SyntaxKind.ClassDeclaration).getNameOrThrow().toString(),
          kind: tsm.SyntaxKind.ClassDeclaration,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.VariableDeclaration, () => {
        const variableDeclarationNode = node.asKindOrThrow(tsm.SyntaxKind.VariableDeclaration);

        return {
          name: variableDeclarationNode.getName(),
          kind: tsm.SyntaxKind.VariableDeclaration,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.ArrowFunction, () => {
        const arrowFunctionNode = node.asKindOrThrow(tsm.SyntaxKind.ArrowFunction);
        const name = arrowFunctionNode.getSymbolOrThrow().getEscapedName();

        return {
          name: getFunctionName(tsm.SyntaxKind.ArrowFunction, name),
          kind: tsm.SyntaxKind.ArrowFunction,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.FunctionDeclaration, () => {
        const functionDeclarationNode = node.asKindOrThrow(tsm.SyntaxKind.FunctionDeclaration);
        const name = functionDeclarationNode.getName();

        return {
          name: getFunctionName(tsm.SyntaxKind.FunctionDeclaration, name),
          kind: tsm.SyntaxKind.FunctionDeclaration,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.InterfaceDeclaration, () => {
        const interfaceDeclarationNode = node.asKindOrThrow(tsm.SyntaxKind.InterfaceDeclaration);
        const name = interfaceDeclarationNode.getName();

        return {
          name,
          kind: tsm.SyntaxKind.InterfaceDeclaration,
          isPureType: true,
        };
      })
      .with(tsm.SyntaxKind.TypeAliasDeclaration, () => {
        const typeAliasDeclarationNode = node.asKindOrThrow(tsm.SyntaxKind.TypeAliasDeclaration);
        const name = typeAliasDeclarationNode.getName();

        return {
          name,
          kind: tsm.SyntaxKind.TypeAliasDeclaration,
          isPureType: true,
        };
      })
      .with(tsm.SyntaxKind.EnumDeclaration, () => {
        const enumDeclarationNode = node.asKindOrThrow(tsm.SyntaxKind.EnumDeclaration);
        const name = enumDeclarationNode.getName();

        return {
          name,
          kind: tsm.SyntaxKind.EnumDeclaration,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.ArrayLiteralExpression, () => {
        /*
         * ArrayLiteralExpression
         * ArrayLiteralExpression have to export default(non-named default export)
         * eg.
         *
         * ```ts
         * export default [ Button, Text, Accordion ];
         * ```
         */
        return {
          name: undefined,
          kind: tsm.SyntaxKind.ArrayLiteralExpression,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.ObjectLiteralExpression, () => {
        /*
         * ObjectLiteralExpression
         * eg.
         *
         * ```ts
         * export { Button, Text, Accordion };
         * ```
         */
        return {
          name: undefined,
          kind: tsm.SyntaxKind.ObjectLiteralExpression,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.BindingElement, () => {
        /*
         * BindingElement
         * eg.
         *
         * ```ts
         * export const { Button, Text, Accordion } = CoreModule;
         * ```
         */
        const bindingElementNode = node.asKindOrThrow(tsm.SyntaxKind.BindingElement);
        const name = bindingElementNode.getName();

        return {
          name,
          kind: tsm.SyntaxKind.BindingElement,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.CallExpression, () => {
        /*
         * CallExpression
         * CallExpression don't have name and only working non-named-export
         * eg.
         *
         * ```ts
         * export default withTheme()(ReactComponent);
         * ```
         */
        return {
          name: undefined,
          kind: tsm.SyntaxKind.CallExpression,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.NewExpression, () => {
        /*
         * NewExpression
         * NewExpression don't have name and only working non-named-export
         * eg.
         *
         * ```ts
         * export default new MyComponent();
         * ```
         */
        return {
          name: undefined,
          kind: tsm.SyntaxKind.NewExpression,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.ModuleDeclaration, () => {
        const moduleDeclarationNode = node.asKindOrThrow(tsm.SyntaxKind.ModuleDeclaration);
        const name = moduleDeclarationNode.getName();

        return {
          name,
          kind: tsm.SyntaxKind.ModuleDeclaration,
          isPureType: false,
        };
      })
      .with(tsm.SyntaxKind.SourceFile, () => {
        /*
         * SourceFile(like Vue.js components)
         * eg.
         *
         * ```ts
         * /// <reference path="../types/vue.d.ts" />
         * import Foo from './Foo.vue';
         * export { Foo };
         * ```
         */
        return {
          name: undefined,
          kind: tsm.SyntaxKind.SourceFile,
          isPureType: false,
        };
      })
      /*
       * Identifier(like React.js components)
       * eg.
       *
       * ```ts
       * /// <reference path="../types/react.d.ts" />
       * import 'react';
       * export const ReactComponent = () => {
       *   return <div><h1>Hello</h1></div>
       * };
       *
       * ReactComponent.getInitialProps = () => {}; // this statement passed by Identifier
       * ```
       */
      .otherwise(() => {
        const sourceFile = node.getSourceFile();
        const filePath = sourceFile.getFilePath();
        const pos = sourceFile.getLineAndColumnAtPos(node.getStart(false));

        throw new NotFoundExportedKind(
          pos,
          filePath,
          node,
          `Cannot support type: (${node.getKind()}) ${node.getText()}`,
        );
      })
  );
}
