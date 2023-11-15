import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { describe, expect, it } from '@jest/globals';
import path from 'node:path';

describe('ExcludeContainer', () => {
  it('getter', () => {
    const container = new ExcludeContainer({
      config: { exclude: ['src/cli/**/*.ts', 'src/compilers/**/*.ts'] },
      inlineExcludeds: [],
      cwd: process.cwd(),
    });

    expect(container.globs).toBeDefined();
    expect(container.map).toBeDefined();
  });

  it('isExclude - no glob files', () => {
    const container = new ExcludeContainer({
      config: { exclude: [] },
      inlineExcludeds: [],
      cwd: process.cwd(),
    });

    const r01 = container.isExclude('src/files/IncludeContainer.ts');
    expect(r01).toBeFalsy();
  });

  it('isExclude', () => {
    const container = new ExcludeContainer({
      config: { exclude: ['src/cli/**/*.ts', 'src/compilers/**/*.ts'] },
      inlineExcludeds: [
        {
          commentCode: 'inline exclude test',
          tag: 'ctix-exclude',
          pos: {
            line: 1,
            start: 1,
            column: 1,
          },
          filePath: 'example/type03/ComparisonCls.tsx',
        },
        {
          commentCode: 'inline exclude test',
          tag: 'ctix-exclude',
          pos: {
            line: 1,
            start: 1,
            column: 1,
          },
          filePath: path.resolve('example/type03/HandsomelyCls.tsx'),
        },
      ],
      cwd: process.cwd(),
    });

    const r01 = container.isExclude('src/files/IncludeContainer.ts');
    const r02 = container.isExclude('src/cli/builders/setModeBundleOptions.ts');
    const r03 = container.isExclude(path.join(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isExclude(
      path.join(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
    );
    const r05 = container.isExclude('example/type03/ComparisonCls.tsx');

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
    expect(r05).toBeTruthy();
  });

  it('isExclude', () => {
    const container = new ExcludeContainer({
      config: {
        exclude: [
          'src/cli/**/*.ts',
          'src/compilers/**/*.ts',
          'examples/**/*.ts',
          '!src/compilers/getTypeScriptProject.ts',
        ],
      },
      inlineExcludeds: [],
      cwd: process.cwd(),
    });

    const r01 = container.isExclude('src/files/IncludeContainer.ts');
    const r02 = container.isExclude('src/cli/builders/setModeBundleOptions.ts');
    const r03 = container.isExclude(path.join(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isExclude(
      path.join(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
    );
    const r05 = container.isExclude(
      path.join(process.cwd(), 'src/cli/compilers/getTypeScriptProject.ts'),
    );

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
    expect(r05).toBeFalsy();
  });
});
