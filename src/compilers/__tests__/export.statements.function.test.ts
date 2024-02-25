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

describe('getExportStatements function, arrow function', () => {
  it('one arrow function, default export by anonymous', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export default () => {};
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
          line: 1,
          column: 16,
        },
        identifier: {
          name: 'default',
          alias: filenamify(uuid),
        },
        isAnonymous: true,
        isPureType: false,
        isDefault: true,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('one arrow function, export by toLocaleString', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export const toLocaleString = (date: Date | number) => new Date(date).toLocaleString();
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
          line: 1,
          column: 14,
        },
        identifier: {
          name: 'toLocaleString',
          alias: filenamify(uuid),
        },
        isAnonymous: false,
        isPureType: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('one function, default export by anonymous', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export default function () {};
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
          line: 1,
          column: 1,
        },
        identifier: {
          name: 'default',
          alias: filenamify(uuid),
        },
        isAnonymous: true,
        isPureType: false,
        isDefault: true,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });
});
