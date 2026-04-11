import { posixJoin } from '#/modules/path/modules/posixJoin';
import { posixResolve } from '#/modules/path/modules/posixResolve';
import { ExcludeContainer } from '#/modules/scope/ExcludeContainer';
import { describe, expect, it } from 'vitest';

/**
 * Converts a posix absolute path to a Windows-style path with backslashes.
 * e.g. /Users/foo/bar.ts => \Users\foo\bar.ts
 * Used to simulate paths that ts-morph returns on Windows.
 */
function toWindowsPath(posixAbsolutePath: string): string {
  return posixAbsolutePath.replace(/\//g, '\\');
}

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

  it('isExclude - Windows-style backslash absolute path should be recognized', () => {
    // Regression test for Windows path separator bug.
    // On Windows, ts-morph returns paths like C:\project\src\foo.ts (backslashes).
    // ExcludeContainer stores posix paths after replaceSepToPosix.
    // isExclude must normalize backslashes before map lookup; otherwise it always returns false.
    const container = new ExcludeContainer({
      config: { exclude: ['src/cli/**/*.ts'] },
      inlineExcludeds: [],
      cwd: process.cwd(),
    });

    // Pick a real file that IS in the exclude map (posix separator)
    const posixPath = Array.from(container.map.keys()).at(0);
    expect(posixPath).toBeDefined();

    // Simulate the Windows path that ts-morph would return on a Windows machine
    const windowsStylePath = toWindowsPath(posixPath!);

    // isExclude must return true — the file is excluded regardless of separator style
    expect(container.isExclude(windowsStylePath)).toBe(true);
  });

  it('isExclude - Windows-style backslash path must not match a non-excluded file', () => {
    // Even after normalizing separators, a file outside the exclude glob must not match.
    const container = new ExcludeContainer({
      config: { exclude: ['src/cli/**/*.ts'] },
      inlineExcludeds: [],
      cwd: process.cwd(),
    });

    // A path that is NOT in the exclude pattern (src/modules, not src/cli)
    const posixPathNotExcluded = posixJoin(process.cwd(), 'src/modules/scope/ExcludeContainer.ts');
    const windowsStylePath = toWindowsPath(posixPathNotExcluded);

    expect(container.isExclude(windowsStylePath)).toBe(false);
  });

  it('isExclude - relative Windows-style backslash path should be recognized', () => {
    // Regression test for relative paths with backslashes on Windows.
    const container = new ExcludeContainer({
      config: { exclude: ['src/cli/**/*.ts'] },
      inlineExcludeds: [],
      cwd: process.cwd(),
    });

    // Simulate a relative Windows-style path (backslashes instead of forward slashes)
    const windowsRelativePath = 'src\\cli\\builders\\setModeBundleOptions.ts';

    expect(container.isExclude(windowsRelativePath)).toBe(true);
  });

  it('isExclude - Windows-style backslash inline excluded path should be recognized', () => {
    // Regression test: inline excludeds stored with posix paths must also match
    // Windows-style paths passed to isExclude.
    const inlineFilePath = posixJoin(process.cwd(), 'examples/type03/ComparisonCls.tsx');
    const container = new ExcludeContainer({
      config: { exclude: [] },
      inlineExcludeds: [
        {
          commentCode: 'inline exclude test',
          tag: 'ctix-exclude',
          pos: { line: 1, start: 1, column: 1 },
          filePath: inlineFilePath,
        },
      ],
      cwd: process.cwd(),
    });

    // Simulate the Windows path version of the same inline-excluded file
    const windowsStylePath = toWindowsPath(inlineFilePath);

    expect(container.isExclude(windowsStylePath)).toBe(true);
  });
});
