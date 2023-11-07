import { getExportedKind } from '#/compilers/getExportedKind';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import * as tsm from 'ts-morph';

const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.example.json');
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

describe('getExportStatements - exception, other SyntaxKind', () => {
  beforeAll(() => {
    const m00Uuid = randomUUID();

    context.files.push({
      uuid: m00Uuid,
      dir: path.join(process.cwd(), '@types'),
      name: `${m00Uuid}.d.ts`,
      filePath: path.join(process.cwd(), '@types', `${m00Uuid}.d.ts`),
      source: `export const value = 'ironman';`.trim(),
    });
  });

  it('unsupport export statements', async () => {
    const m02 = context.project.createSourceFile(
      context.files[0].filePath,
      context.files[0].source,
    );

    const inp01 = m02.getVariableStatement('value');

    expect(() => {
      getExportedKind(inp01 as any);
    }).toThrowError();
  });
});
