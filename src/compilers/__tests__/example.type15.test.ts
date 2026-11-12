import { getExportStatement } from '#/compilers/getExportStatement';
import { getRenderData } from '#/templates/modules/getRenderData';
import { getSelectStyle } from '#/templates/modules/getSelectStyle';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import { Eta } from 'eta';
import path from 'node:path';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

describe('type15 namespace example', () => {
  it.each(['auto', 'default-alias-named-destructive', 'default-alias-named-star'] as const)(
    'generates a type-safe barrel with style %s',
    async (style) => {
      const projectPath = path.resolve('examples/type15/tsconfig.json');
      const project = new tsm.Project({ tsConfigFilePath: projectPath });
      const sourceFiles = project.getSourceFiles();
      const eta = new Eta({ autoEscape: false, rmWhitespace: true });
      const rendered = await Promise.all(
        sourceFiles.map(async (sourceFile) => {
          const statements = await getExportStatement(
            sourceFile,
            { project: projectPath, exportFilename: 'index.ts' },
            { eol: '\n' },
          );
          if (sourceFile.getBaseName() !== 'Namespaces.ts') {
            expect(statements[0]).toMatchObject({
              isDefault: true,
              isPureType: false,
              isExcluded: false,
            });
          }
          const renderData = getRenderData(
            { fileExt: 'none', quote: "'", useSemicolon: true },
            sourceFile.getFilePath(),
            statements,
            path.resolve('examples/type15/src'),
          );
          if (renderData == null) return '';
          const selected = getSelectStyle({ options: { style }, renderData });
          const template = TemplateContainer.getDefaultTemplate().get(selected.style);
          if (template == null) throw new Error('Expected export template');
          return eta.renderString(template, renderData);
        }),
      );
      const barrel = rendered.join('\n');
      expect(barrel).not.toMatch(/\b(?:Empty|EmptyNested|Excluded)\b/);
      expect(barrel).toContain('type TypesOnly');
      expect(barrel).toContain('PublicNested');
      expect(barrel).not.toContain('type default');
      project.createSourceFile(path.resolve('examples/type15/src/index.ts'), barrel, {
        overwrite: true,
      });
      project.createSourceFile(
        path.resolve('examples/type15/src/consumer.ts'),
        `
import { PublicNested, Repeated, type TypesOnly } from './index';
import InterfaceFirst from './InterfaceFirst';
import NamespaceFirst from './NamespaceFirst';
const first: InterfaceFirst = InterfaceFirst.create();
const second: NamespaceFirst = NamespaceFirst.create();
const item: TypesOnly.Item = { name: first.name + second.name };
const nestedValue: number = PublicNested.Inner.value;
const repeatedValue: number = Repeated.value;
// @ts-expect-error Excluded namespaces must not be exported.
import { Empty, EmptyNested, Excluded } from './index';
`,
      );
      expect(
        project.getPreEmitDiagnostics().map((diagnostic) => diagnostic.getMessageText()),
      ).toEqual([]);
    },
  );
});
