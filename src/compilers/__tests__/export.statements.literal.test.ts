import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { replaceSepToPosix } from 'my-node-fp';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('getExportStatements - literal export statement', () => {
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
});
