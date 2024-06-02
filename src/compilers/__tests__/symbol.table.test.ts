import { SymbolTable } from '#/compilers/SymbolTable';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const tsconfigPath = posixJoin(process.cwd(), 'examples', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('SymbolTable', () => {
  it('getter', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class Ability {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const st = new SymbolTable(sourceFile);

    expect(Array.from(st.table.keys())).toEqual([0, 98, 197]);
  });

  it('first class', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class Ability {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const st = new SymbolTable(sourceFile);

    expect(st.getByPos(0)?.getText()).toEqual(`export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}`);
  });
});
