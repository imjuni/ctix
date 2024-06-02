import { getExportedKind } from '#/compilers/getExportedKind';
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

describe('getExportStatements - exception, other SyntaxKind', () => {
  beforeAll(() => {
    const m00Uuid = randomUUID();

    context.files.push({
      uuid: m00Uuid,
      dir: posixJoin(process.cwd(), '@types'),
      name: `${m00Uuid}.d.ts`,
      filePath: posixJoin(process.cwd(), '@types', `${m00Uuid}.d.ts`),
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
