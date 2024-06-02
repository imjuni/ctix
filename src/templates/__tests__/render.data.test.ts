import { getExportStatement } from '#/compilers/getExportStatement';
import { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { getRenderData } from '#/templates/modules/getRenderData';
import { replaceSepToPosix } from 'my-node-fp';
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

describe('getAutoRenderCase', () => {
  it('render export statement', async () => {
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
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statements = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    const r01 = getRenderData(
      {
        fileExt: CE_EXTENSION_PROCESSING.REPLACE_JS,
        quote: "'",
        useSemicolon: true,
      },
      filename,
      statements,
    );

    expect(r01).toMatchObject({
      options: {
        quote: "'",
        useSemicolon: true,
      },
      filePath: filename,
      statement: {
        extname: {
          origin: '.ts',
          render: '.js',
        },
        importPath: `./${uuid}`,
        isHasDefault: false,
        isHasPartialExclude: false,
        named: [
          {
            path: {
              filename,
              dirPath: replaceSepToPosix(process.cwd()),
              relativePath: '..',
            },
            depth: 2,
            identifier: {
              name: 'MarvelHero',
              alias: filenamify(uuid),
            },
            isPureType: false,
            isAnonymous: false,
            isDefault: false,
            isExcluded: false,
            comments: [],
          },
          {
            path: {
              filename,
              dirPath: replaceSepToPosix(process.cwd()),
              relativePath: '..',
            },
            depth: 2,
            identifier: {
              name: 'DCHero',
              alias: filenamify(uuid),
            },
            isPureType: false,
            isAnonymous: false,
            isDefault: false,
            isExcluded: false,
            comments: [],
          },
        ],
      },
    });
  });

  it('every statement excluded', async () => {
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
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statements = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    const r01 = getRenderData(
      {
        fileExt: CE_EXTENSION_PROCESSING.REPLACE_JS,
        quote: "'",
        useSemicolon: false,
      },
      filename,
      statements.map((statement) => ({ ...statement, isExcluded: true })),
    );

    expect(r01).toBeUndefined();
  });

  it('pass output params', async () => {
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
    `;

    const sourceFile = context.project.createSourceFile(
      posixJoin(process.cwd(), 'examples', filename),
      source.trim(),
    );

    const statements = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    const r01 = getRenderData(
      {
        fileExt: CE_EXTENSION_PROCESSING.REPLACE_JS,
        quote: "'",
        useSemicolon: false,
      },
      filename,
      statements.map((statement) => ({ ...statement, isExcluded: false })),
      posixJoin(process.cwd(), 'examples'),
    );

    expect(r01).toMatchObject({
      options: {
        quote: "'",
        useSemicolon: false,
      },
      filePath: filename,
      statement: {
        extname: {
          origin: '.ts',
          render: '.js',
        },
        importPath: `../${uuid}`,
        isHasDefault: false,
        isHasPartialExclude: false,
        default: undefined,
        named: [
          {
            path: {
              dirPath: posixJoin(process.cwd(), 'examples'),
              relativePath: '',
            },
            depth: 1,
            pos: {
              line: 1,
              column: 1,
            },
            identifier: {
              name: 'MarvelHero',
              alias: filenamify(filename),
            },
            isPureType: false,
            isAnonymous: false,
            isDefault: false,
            isExcluded: false,
            comments: [],
          },
          {
            path: {
              filename,
              dirPath: posixJoin(process.cwd(), 'examples'),
              relativePath: '',
            },
            depth: 1,
            pos: {
              line: 9,
              column: 1,
            },
            identifier: {
              name: 'DCHero',
              alias: filenamify(filename),
            },
            isPureType: false,
            isAnonymous: false,
            isDefault: false,
            isExcluded: false,
            comments: [],
          },
        ],
      },
    });
  });
});
