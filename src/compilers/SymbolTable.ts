import type * as tsm from 'ts-morph';

export class SymbolTable {
  #table: Map<number, tsm.Node>;

  constructor(sourceFile: tsm.SourceFile) {
    const nodes: [number, tsm.Node][] = [];

    sourceFile.forEachChild((node) => {
      const pos = node.getStart();
      nodes.push([pos, node]);
    });

    this.#table = new Map<number, tsm.Node>(nodes);
  }

  get table(): Readonly<Map<number, tsm.Node>> {
    return this.#table;
  }

  getByPos(pos: number): tsm.Node | undefined {
    return this.#table.get(pos);
  }
}
