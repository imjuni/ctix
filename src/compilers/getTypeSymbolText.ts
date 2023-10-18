import type * as tsm from 'ts-morph';

export function getTypeSymbolText(
  typeNode: tsm.Type,
  declarationNodeCallback?: (declarationNode: tsm.Node) => string,
): string {
  const symbol = typeNode.getSymbol();
  const aliasSymbol = typeNode.getAliasSymbol();

  if (symbol != null) {
    const [declarationNode] = symbol.getDeclarations();
    return declarationNodeCallback == null
      ? declarationNode.getText()
      : declarationNodeCallback(declarationNode);
  }

  if (aliasSymbol != null) {
    return aliasSymbol.getEscapedName();
  }

  return typeNode.getText();
  // throw new Error(`Cannot acquire text from type node: ${typeNode.getText()}`);
}
