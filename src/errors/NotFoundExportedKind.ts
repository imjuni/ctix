import type { IReason } from '#/compilers/interfaces/IReason';
import type * as tsm from 'ts-morph';

export class NotFoundExportedKind extends Error {
  #pos: { line: number; column: number };

  #filePath: string;

  #node: tsm.Node;

  get pos() {
    return this.#pos;
  }

  get filePath() {
    return this.#filePath;
  }

  get node() {
    return this.#node;
  }

  constructor(
    pos: NotFoundExportedKind['pos'],
    filePath: string,
    node: tsm.Node,
    message?: string,
  ) {
    super(message);

    this.#pos = pos;
    this.#node = node;
    this.#filePath = filePath;
  }

  createReason() {
    const message =
      `Cannot support export statement: (${this.#node.getKind()}) ${this.#node.getText()}`.trim();

    const reason: IReason = {
      type: 'error',
      lineAndCharacter: {
        line: this.#pos.line,
        character: this.#pos.column,
      },
      nodes: [this.#node],
      filePath: this.#filePath,
      message,
    };

    return reason;
  }
}
