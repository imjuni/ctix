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

describe('getExportStatements - Variable', () => {
  it('one component with assignment, named export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export const ReactComponent = () => {};

ReactComponent.getInitialProps = () => {};
ReactComponent.props = { name: 'ironman' };
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
        identifier: { name: 'ReactComponent', alias: filenamify(filename) },
        isAnonymous: false,
        isPureType: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('one component with assignment, default export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
const ReactComponent = () => {};

ReactComponent.getInitialProps = () => {};
ReactComponent.props = { name: 'ironman' };

export default ReactComponent;
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
          column: 7,
        },
        identifier: { name: 'default', alias: 'ReactComponent' },
        isAnonymous: false,
        isPureType: false,
        isDefault: true,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('call expression, default export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
const ReactComponent = () => {};
const withComponent = () => (comp) => comp;

ReactComponent.getInitialProps = () => {};
ReactComponent.props = { name: 'ironman' };

export default withComponent()(ReactComponent);
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
        identifier: { name: 'default', alias: filenamify(filename) },
        isPureType: false,
        isAnonymous: true,
        isDefault: true,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('one variable with assignment, default export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
const CONST_VALUE = 1004;

export default CONST_VALUE;
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
          column: 7,
        },
        identifier: { name: 'default', alias: 'CONST_VALUE' },
        isPureType: false,
        isAnonymous: false,
        isDefault: true,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('const-enum with assignment, default export', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export const CE_CTIX_DEFAULT_VALUE = {
  CONFIG_FILENAME: '.ctirc',
  TSCONFIG_FILENAME: 'tsconfig.json',
} as const;

export type CE_CTIX_DEFAULT_VALUE =
  (typeof CE_CTIX_DEFAULT_VALUE)[keyof typeof CE_CTIX_DEFAULT_VALUE];
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
        identifier: { name: 'CE_CTIX_DEFAULT_VALUE', alias: filenamify(filename) },
        isPureType: false,
        isAnonymous: false,
        isDefault: false,
        isExcluded: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });
});
