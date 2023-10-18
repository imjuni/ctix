import type * as tsm from 'ts-morph';

export interface IIdentifierWithNode {
  identifier: string;
  node: tsm.Node;
  isIsolatedModules: boolean;
  moduleDeclaration?: string;
}
