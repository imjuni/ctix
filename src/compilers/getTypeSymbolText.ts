import { isEmpty, isNotEmpty } from 'my-easy-fp';
import * as tsm from 'ts-morph';

export default function getTypeSymbolText(
  typeNode: tsm.Type,
  declarationNodeCallback?: (declarationNode: tsm.Node) => string,
): string {
  const symbol = typeNode.getSymbol();
  const aliasSymbol = typeNode.getAliasSymbol();

  if (isNotEmpty(symbol)) {
    const [declarationNode] = symbol.getDeclarations();
    return isEmpty(declarationNodeCallback)
      ? declarationNode.getText()
      : declarationNodeCallback(declarationNode);
  }

  if (isNotEmpty(aliasSymbol)) {
    return aliasSymbol.getEscapedName();
  }

  return typeNode.getText();
  // throw new Error(`Cannot acquire text from type node: ${typeNode.getText()}`);
}
