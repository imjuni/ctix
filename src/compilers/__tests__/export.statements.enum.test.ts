import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/modules/posixJoin';
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

describe('getExportStatements - Enum', () => {
  it('greator than once, named export interface', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
    export enum EN_HERO {
      IRONMAN,
      HULK,
    }

    enum EN_DIRECTION {
      Up,
      Down,
      Left,
      Right,
    }
    
    export default EN_DIRECTION;
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
          line: 6,
          column: 5,
        },
        identifier: { alias: 'EN_DIRECTION', name: 'default' },
        isPureType: false,
        isAnonymous: false,
        isDefault: true,
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
          line: 1,
          column: 1,
        },
        identifier: { alias: filenamify(filename), name: 'EN_HERO' },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });
});
