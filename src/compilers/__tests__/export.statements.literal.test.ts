import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { replaceSepToPosix } from 'my-node-fp';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { beforeAll, describe, expect, it } from 'vitest';

const tsconfigPath = posixJoin(process.cwd(), 'examples', 'tsconfig.example.json');
const context: { tsconfig: string; project: tsm.Project } = {
  tsconfig: tsconfigPath,
} as any;

describe('getExportStatements - literal export statement', () => {
  beforeAll(() => {
    context.project = new tsm.Project({
      tsConfigFilePath: tsconfigPath,
    });
  });

  it('array literal, default export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
const name = 'ironman';
const team = 'Avengers';
const ability = ['repulsor rays', 'flying'];

export default [ name, age ]
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statement = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 5,
          column: 16,
        },
        identifier: { name: 'default', alias: filenamify(filename) },
        isPureType: false,
        isAnonymous: true,
        isDefault: true,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('object literal, default export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
const name = 'ironman';
const team = 'Avengers';
const ability = ['repulsor rays', 'flying'];

export default { name, age };
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statement = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 5,
          column: 16,
        },
        identifier: { name: 'default', alias: filenamify(filename) },
        isPureType: false,
        isAnonymous: true,
        isDefault: true,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('binding element, default export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
const IronMan = { 
  name: 'ironman',
  team: 'Avengers',
  ability: ['repulsor rays', 'flying'],
};

export const { name, age, ability } = IronMan;
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statement = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 7,
          column: 16,
        },
        identifier: { name: 'name', alias: filenamify(filename) },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
      {
        path: {
          filename,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 7,
          column: 22,
        },
        identifier: { name: 'age', alias: filenamify(filename) },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
      {
        path: {
          filename,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 7,
          column: 27,
        },
        identifier: { name: 'ability', alias: filenamify(filename) },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('binding element, named exports using alias', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
interface ISuperHero { 
  name: string;
  team: string;
  ability: string[];
};

interface Options { 
  name: string;
  team: string;
  ability: string[];
};

export { ISuperHero, Options as ISuperHeroOptions };
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statement = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename: `${uuid}.ts`,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 1,
          column: 1,
        },
        identifier: {
          name: 'ISuperHero',
          alias: filenamify(uuid),
        },
        isPureType: true,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      },
      {
        path: {
          filename: `${uuid}.ts`,
          dirPath: replaceSepToPosix(process.cwd()),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 7,
          column: 1,
        },
        identifier: {
          name: 'ISuperHeroOptions',
          alias: 'Options',
        },
        isPureType: true,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      },
    ]);
  });
});
