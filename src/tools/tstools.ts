import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import { isEmpty, isFalse } from 'my-easy-fp';
import typescript from 'typescript';

const log = debug('ctixd:ignore-tool');

export type TStatementModifierType = 'exported' | 'default' | 'none';

/**
 * Check syntax on passed TypeScript node, find export modifier from TypeScript node.
 * If found export modifier from node this return 'exported' and found default export
 * from node return 'default' another case return 'none'
 *
 * @param nodeFrom TypeScript statement node
 */
export const hasExportModifiers = (nodeFrom: typescript.Node): TStatementModifierType =>
  TFU.pipe(
    nodeFrom,
    (node) => node.modifiers,
    (modifiers) =>
      isEmpty(modifiers) ? TEI.left<TStatementModifierType>('none') : TEI.right(modifiers),
    TEI.fold(
      (flag: TStatementModifierType) => flag,
      (modifiers) => {
        const exported =
          modifiers.some((modifier) => modifier.kind === typescript.SyntaxKind.ExportKeyword) ??
          false;

        const defaulted =
          modifiers?.some((modifier) => modifier.kind === typescript.SyntaxKind.DefaultKeyword) ??
          false;

        if (exported && defaulted) {
          return 'default';
        }

        if (exported && isFalse(defaulted)) {
          return 'exported';
        }

        return 'none';
      },
    ),
  );

/**
 * classify node export node and normal node.
 *
 * @param source parameter is depth-0 root node typescript node
 */
export async function delintNode({
  source: rootNode,
  filename,
}: {
  source: typescript.Node;
  filename: string;
}): Promise<{ filename: string; export: typescript.Node[]; default: typescript.Node[] }> {
  const exportNodes: typescript.Node[] = [];
  const defaultExportedNodes: typescript.Node[] = [];

  log('delintNode: ', filename);

  let isExported = '';

  const nodeWalk = (currentNode: typescript.Node) => {
    switch (currentNode.kind) {
      case typescript.SyntaxKind.VariableStatement:
      case typescript.SyntaxKind.InterfaceDeclaration:
      case typescript.SyntaxKind.TypeAliasDeclaration:
      case typescript.SyntaxKind.FunctionDeclaration:
      case typescript.SyntaxKind.ClassDeclaration:
      case typescript.SyntaxKind.EnumDeclaration:
        isExported = hasExportModifiers(currentNode);

        if (isExported === 'default') {
          defaultExportedNodes.push(currentNode);
        }

        if (isExported === 'exported') {
          exportNodes.push(currentNode);
        }

        break;
      // ExportAssignment standalone export syntax in typescript
      // example>
      // ```ts
      // export interface IThisInterface {}
      // export type TTAlias2 = IThisInterface;
      //
      // export default TTAlias2; // this line working to ExportAssignment
      // ```
      //
      // ExportAssignment is always working to export default
      case typescript.SyntaxKind.ExportAssignment:
        defaultExportedNodes.push(currentNode);
        break;
      default:
    }

    typescript.forEachChild(currentNode, nodeWalk);
  };

  nodeWalk(rootNode);

  return { filename, export: exportNodes, default: defaultExportedNodes };
}
