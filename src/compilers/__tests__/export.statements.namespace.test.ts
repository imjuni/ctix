import { getExportStatement } from '#/compilers/getExportStatement';
import { getRenderData } from '#/templates/modules/getRenderData';
import { getSelectStyle } from '#/templates/modules/getSelectStyle';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { Eta } from 'eta';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

async function extract(source: string) {
  const project = new tsm.Project({ useInMemoryFileSystem: true });
  const file = project.createSourceFile('/example.ts', source);
  return getExportStatement(
    file,
    { project: '/tsconfig.json', exportFilename: 'index.ts' },
    { eol: '\n' },
  );
}

describe('merged namespace exports', () => {
  it.each([false, true])(
    'preserves default values regardless of declaration order: %s',
    async (reverse) => {
      const declarations = [
        'interface Example { name: string }',
        'namespace Example { export const value = 1; }',
      ];
      if (reverse) declarations.reverse();
      const statements = await extract(`${declarations.join('\n')}\nexport default Example;`);
      expect(statements[0].isPureType).toBe(false);
    },
  );

  it.each([0, 1])(
    'excludes the entire merged namespace from declaration %s',
    async (excludedIndex) => {
      const declarations = [
        'export namespace Example { export interface Item {} }',
        'export namespace Example { export const value = 1; }',
      ];
      declarations[excludedIndex] = `/** @ctix-exclude-next */\n${declarations[excludedIndex]}`;
      const statements = await extract(`${declarations.join('\n')}\nexport const Other = 2;`);
      expect(
        statements.find((statement) => statement.identifier.name === 'Example')?.isExcluded,
      ).toBe(true);
      expect(
        statements.find((statement) => statement.identifier.name === 'Other')?.isExcluded,
      ).toBe(false);
    },
  );

  it('ignores nested exclusion comments', async () => {
    const statements = await extract(
      'export namespace Example { /** @ctix-exclude-next */\n export const value = 1; }',
    );
    expect(statements[0]).toMatchObject({ isExcluded: false, isPureType: false });
  });

  it('recognizes type-only namespaces', async () => {
    const statements = await extract('export namespace Example { export interface Item {} }');
    expect(statements[0].isPureType).toBe(true);
  });
  it('honors exclusion on a default export assignment', async () => {
    const statements = await extract(`namespace Example { export const value = 1; }
/** @ctix-exclude-next */
export default Example;`);
    expect(statements[0].isExcluded).toBe(true);
  });

  it('preserves explicit type-only exports of value namespaces', async () => {
    const statements = await extract(`namespace Example { export const value = 1; }
export type { Example };`);
    expect(statements[0].isPureType).toBe(true);
  });

  it('honors exclusion on a named export statement', async () => {
    const statements = await extract(`namespace Example { export const value = 1; }
/** @ctix-exclude-next */
export { Example };`);
    expect(statements[0].isExcluded).toBe(true);
  });
  it.each([
    'export namespace Example {}',
    'export namespace Example { interface Private {} }',
    'export namespace Example { export namespace Inner { interface Private {} } }',
  ])('excludes namespaces without public members: %s', async (source) => {
    expect((await extract(source))[0].isExcluded).toBe(true);
  });

  it.each([
    'export namespace Example { export namespace Inner { export interface Public {} } }',
    'export namespace Example.Inner { export const value = 1; }',
    'export namespace Example {} export namespace Example { export interface Public {} }',
    'export interface Example {} export namespace Example {}',
  ])('includes public nested or merged members: %s', async (source) => {
    expect((await extract(source))[0].isExcluded).toBe(false);
  });
  it('renders a barrel that preserves public namespaces and omits empty namespaces', async () => {
    const source = `export namespace Hidden { interface Private {} }
export namespace Visible { export namespace Inner { export const value = 42; } }`;
    const statements = await extract(source);
    const renderData = getRenderData(
      { fileExt: 'none', quote: "'", useSemicolon: true },
      '/example.ts',
      statements,
      '/',
    );
    expect(renderData).toBeDefined();
    if (renderData == null) throw new Error('Expected render data');
    const selected = getSelectStyle({ options: { style: 'default-star-named-star' }, renderData });
    const template = TemplateContainer.getDefaultTemplate().get(selected.style);
    if (template == null) throw new Error('Expected template');
    const barrel = new Eta({ autoEscape: false, rmWhitespace: true }).renderString(
      template,
      renderData,
    );
    expect(barrel).toContain('Visible');
    expect(barrel).not.toContain('Hidden');
    expect(barrel).not.toContain('export *');
    const project = new tsm.Project({ useInMemoryFileSystem: true });
    project.createSourceFile('/example.ts', source);
    project.createSourceFile('/index.ts', barrel);
    project.createSourceFile(
      '/consumer.ts',
      "import { Visible } from './index'; const value: number = Visible.Inner.value;",
    );
    expect(project.getPreEmitDiagnostics()).toEqual([]);
  });
});
