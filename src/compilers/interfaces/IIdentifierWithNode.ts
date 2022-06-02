import * as tsm from 'ts-morph';

export default interface IIdentifierWithNode {
  identifier: string;
  node: tsm.Node;
}
