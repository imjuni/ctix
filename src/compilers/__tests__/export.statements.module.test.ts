import { getExportStatement } from '#/compilers/getExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { beforeAll, describe, expect, it } from 'vitest';

const tsconfigPath = posixJoin(process.cwd(), 'examples', 'tsconfig.example.json');
const context: {
  tsconfig: string;
  project: tsm.Project;
  files: { filePath: string; name: string; dir: string; uuid: string; source: string }[];
} = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
  files: [],
};

describe('getExportStatements - Module', () => {
  beforeAll(() => {
    const m00Uuid = randomUUID();
    const m01Uuid = randomUUID();

    context.files.push({
      uuid: m00Uuid,
      dir: posixJoin(process.cwd(), '@types'),
      name: `${m00Uuid}.d.ts`,
      filePath: posixJoin(process.cwd(), '@types', `${m00Uuid}.d.ts`),
      source: `declare module '*.ttf';`.trim(),
    });

    context.files.push({
      uuid: m01Uuid,
      dir: posixJoin(process.cwd(), 'lib'),
      name: `${m01Uuid}.ts`,
      filePath: posixJoin(process.cwd(), 'lib', `${m01Uuid}.ts`),
      source: `    
      /// <reference path="../@types/DeclareTtfModule.d.ts" />
      import Friend from 'Friend.ttf';
      import AlsoFriend from './fonts/AlsoFriend.ttf';

      export { Friend, AlsoFriend };`.trim(),
    });
  });

  it('greator than once, named export interface', async () => {
    context.project.createSourceFile(context.files[0].filePath, context.files[0].source);

    const m02 = context.project.createSourceFile(
      context.files[1].filePath,
      context.files[1].source,
    );

    const statement = await getExportStatement(
      m02,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename: context.files[1].name,
          dirPath: context.files[1].dir,
          relativePath: '../lib',
        },
        depth: 3,
        pos: { line: 1, column: 1 },
        identifier: { name: 'Friend', alias: filenamify(context.files[1].uuid) },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      },
      {
        path: {
          filename: context.files[1].name,
          dirPath: context.files[1].dir,
          relativePath: '../lib',
        },
        depth: 3,
        pos: { line: 1, column: 1 },
        identifier: {
          name: 'AlsoFriend',
          alias: filenamify(context.files[1].uuid),
        },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      },
    ]);
  });
});
