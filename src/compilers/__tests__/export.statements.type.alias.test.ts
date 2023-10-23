import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { describe, expect, it } from '@jest/globals';
import { randomUUID } from 'crypto';
import path from 'path';
import * as tsm from 'ts-morph';

const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('getExportStatements - Type Alias', () => {
  it('one type alias, named export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export type THero = { name: string; ability: string[] };
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
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 1,
          column: 1,
        },
        identifier: { name: 'THero', alias: filenamify(filename) },
        isPureType: true,
        isAnonymous: false,
        isDefault: false,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('more than once, type alias, named export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export type THero = { name: string; ability: string[]; };

type TSuperHero = { name: string; ability: string[]; age: number };

export default TSuperHero;
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
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 3,
          column: 1,
        },
        identifier: { name: 'default', alias: 'TSuperHero' },
        isPureType: true,
        isAnonymous: false,
        isDefault: true,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
      {
        path: {
          filename,
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 1,
          column: 1,
        },
        identifier: { name: 'THero', alias: filenamify(filename) },
        isPureType: true,
        isAnonymous: false,
        isDefault: false,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });
});
