import { getExportStatement } from '#/compilers/getExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { posixJoin } from '#/modules/path/posixJoin';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { beforeAll, describe, expect, it } from 'vitest';

const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.example.json');
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

describe('getExportStatements - SourceFile', () => {
  beforeAll(() => {
    const m00Uuid = randomUUID();
    const m01Uuid = randomUUID();
    const m02Uuid = randomUUID();

    context.files.push({
      uuid: m00Uuid,
      dir: posixJoin(process.cwd(), '@types'),
      name: `${m00Uuid}.d.ts`,
      filePath: posixJoin(process.cwd(), '@types', `${m00Uuid}.d.ts`),
      source: `    
      declare module '*.vue' {
        import Vue from 'vue';
        export default Vue;
      }`.trim(),
    });

    context.files.push({
      uuid: m01Uuid,
      dir: posixJoin(process.cwd(), 'lib'),
      name: `${m01Uuid}.ts`,
      filePath: posixJoin(process.cwd(), 'lib', `${m01Uuid}.ts`),
      source: `    
      export function identity <T>(value: T): T {
        return value;
      }`.trim(),
    });

    context.files.push({
      uuid: m02Uuid,
      dir: posixJoin(process.cwd(), 'components'),
      name: `${m02Uuid}.ts`,
      filePath: posixJoin(process.cwd(), 'components', `${m02Uuid}.ts`),
      source: `    
      /// <reference path="../@types/${m00Uuid}.d.ts" />
      import Foo from './Foo.vue';

      export { Foo };`.trim(),
    });
  });

  it('vue components, compiler API return SourceFile', async () => {
    context.project.createSourceFile(context.files[0].filePath, context.files[0].source);
    context.project.createSourceFile(context.files[1].filePath, context.files[1].source);

    const m02 = context.project.createSourceFile(
      context.files[2].filePath,
      context.files[2].source,
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
          filename: context.files[2].name,
          dirPath: context.files[2].dir,
          relativePath: '../components',
        },
        depth: 3,
        pos: { line: 1, column: 1 },
        identifier: { name: 'Foo', alias: filenamify(context.files[2].name) },
        isPureType: false,
        isAnonymous: true,
        isDefault: false,
        isExcluded: false,
        comments: [],
      },
    ]);
  });
});
