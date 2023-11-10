import { describe, expect, it } from '@jest/globals';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import * as tsm from 'ts-morph';
import { SymbolTable } from '../SymbolTable';

const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.example.json');
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
