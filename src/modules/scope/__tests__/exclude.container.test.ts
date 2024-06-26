import { posixJoin } from '#/modules/path/modules/posixJoin';
import { posixResolve } from '#/modules/path/modules/posixResolve';
import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { describe, expect, it } from 'vitest';

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
          filePath: 'examples/type03/ComparisonCls.tsx',
        },
        {
          commentCode: 'inline exclude test',
          tag: 'ctix-exclude',
          pos: {
            line: 1,
            start: 1,
            column: 1,
          },
          filePath: posixResolve('examples/type03/HandsomelyCls.tsx'),
        },
      ],
      cwd: process.cwd(),
    });

    const r01 = container.isExclude('src/files/IncludeContainer.ts');
    const r02 = container.isExclude('src/cli/builders/setModeBundleOptions.ts');
    const r03 = container.isExclude(posixJoin(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isExclude(
      posixJoin(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
    );
    const r05 = container.isExclude('examples/type03/ComparisonCls.tsx');

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
    const r03 = container.isExclude(posixJoin(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isExclude(
      posixJoin(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
    );
    const r05 = container.isExclude(
      posixJoin(process.cwd(), 'src/cli/compilers/getTypeScriptProject.ts'),
    );

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
    expect(r05).toBeFalsy();
  });
});
