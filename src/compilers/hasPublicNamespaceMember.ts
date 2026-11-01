import * as tsm from 'ts-morph';

export function hasPublicNamespaceMember(declarations: tsm.ExportedDeclarations[]): boolean {
  const namespaces = declarations.filter(tsm.Node.isModuleDeclaration);
  if (namespaces.length === 0 || declarations.some((node) => !tsm.Node.isModuleDeclaration(node))) {
    return true;
  }
  const visited = new Set<tsm.Symbol>();
  const hasPublicMember = (symbol: tsm.Symbol): boolean => {
    const resolved = symbol.isAlias() ? symbol.getAliasedSymbol() : symbol;
    if (resolved == null || visited.has(resolved)) return false;
    visited.add(resolved);
    return resolved.getExports().some((member) => {
      const target = member.isAlias() ? member.getAliasedSymbol() : member;
      if (target == null) return false;
      const members = target.getDeclarations();
      if (members.some((node) => !tsm.Node.isModuleDeclaration(node))) return true;
      return hasPublicMember(target);
    });
  };
  return namespaces.some((namespace) => {
    if (!tsm.Node.isIdentifier(namespace.getNameNode())) return true;
    const symbol = namespace.getSymbol();
    return symbol != null && hasPublicMember(symbol);
  });
}
