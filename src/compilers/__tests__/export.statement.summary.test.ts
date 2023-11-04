import { getSummaryStatement } from '#/compilers/getSummaryStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/posixJoin';
import { describe, expect, it } from '@jest/globals';
import { randomUUID } from 'crypto';
import { atOrThrow } from 'my-easy-fp';
import path from 'node:path';
import * as tsm from 'ts-morph';

const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('getSummaryStatement', () => {
  it('identifier, isDefault is not null', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
    const exportedDeclaration = atOrThrow(exportedDeclarationsMap.get('default') ?? [], 0);

    const statement = getSummaryStatement({
      node: exportedDeclaration,
      project: process.cwd(),
      identifier: 'identifier-value',
      eol: '\n',
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
      isDefault: true,
    });

    expect(statement).toMatchObject({
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
      depth: 0,
      pos: {
        line: 1,
        column: 1,
      },
      identifier: { name: 'identifier-value', alias: 'Hero' },
      isPureType: false,
      isAnonymous: false,
      isDefault: true,
      isExcluded: false,
      comments: [],
    } satisfies IExportStatement);
  });

  it('identifier, isDefault is null', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
    const exportedDeclaration = atOrThrow(exportedDeclarationsMap.get('default') ?? [], 0);

    const statement = getSummaryStatement({
      node: exportedDeclaration,
      project: process.cwd(),
      eol: '\n',
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
    });

    expect(statement).toMatchObject({
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
      depth: 0,
      pos: {
        line: 1,
        column: 1,
      },
      identifier: {
        name: 'Hero',
        alias: filenamify(filename),
      },
      isPureType: false,
      isAnonymous: false,
      isDefault: false,
      isExcluded: false,
      comments: [],
    } satisfies IExportStatement);
  });

  it('value, anonymous arrow function', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export default () => 'invalid use case';
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
    const exportedDeclaration = atOrThrow(exportedDeclarationsMap.get('default') ?? [], 0);

    const statement = getSummaryStatement({
      node: exportedDeclaration,
      project: process.cwd(),
      eol: '\n',
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
    });

    expect(statement).toMatchObject({
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
      pos: {
        line: 1,
        column: 16,
      },
      depth: 0,
      identifier: {
        name: filenamify(filename),
        alias: filenamify(filename),
      },
      isPureType: false,
      isAnonymous: true,
      isDefault: false,
      isExcluded: false,
      comments: [],
    } satisfies IExportStatement);
  });

  it('identifier, with inline exclude comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export class MarvelHero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class DCHero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

/** @ctix-exclude-next */
export class UnknownHero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
    const exportedDeclaration = atOrThrow(exportedDeclarationsMap.get('UnknownHero') ?? [], 0);

    const statement = getSummaryStatement({
      node: exportedDeclaration,
      project: process.cwd(),
      eol: '\n',
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
    });

    expect(statement).toMatchObject({
      path: {
        filename: posixJoin(process.cwd(), uuid),
        dirPath: process.cwd(),
        relativePath: process.cwd(),
      },
      depth: 0,
      pos: {
        line: 18,
        column: 1,
      },
      identifier: {
        name: 'UnknownHero',
        alias: filenamify(filename),
      },
      isPureType: false,
      isAnonymous: false,
      isDefault: false,
      isExcluded: true,
      comments: [
        {
          commentCode: '/** @ctix-exclude-next */',
          line: 0,
          namespaces: undefined,
          pos: 4,
        },
      ],
    } satisfies IExportStatement);
  });
});
