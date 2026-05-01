import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob } from 'glob';
import { describe, expect, it } from 'vitest';

/**
 * Converts a posix absolute path to a Windows-style path with backslashes.
 * e.g. /Users/foo/bar.ts => \Users\foo\bar.ts
 * Used to simulate paths that ts-morph returns on Windows.
 */
function toWindowsPath(posixAbsolutePath: string): string {
  return posixAbsolutePath.replace(/\//g, '\\');
}

describe('IncludeContainer', () => {
  it('getter', () => {
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts', 'src/compilers/**/*.ts', 'examples/**/*.ts'] },
      cwd: process.cwd(),
    });

    expect(container.globs).toBeDefined();
    expect(container.map).toBeDefined();
  });

  it('isInclude - no include patterns defaults to all ts/tsx under cwd', () => {
    // When no include patterns are specified (empty array), IncludeContainer falls back to
    // **/*.ts and **/*.tsx within the project cwd. Files that exist under cwd pass;
    // the map is never empty so unrelated workspace packages are not pulled in.
    const container = new IncludeContainer({
      config: { include: [] },
      cwd: process.cwd(),
    });

    // map must not be empty — default patterns should have matched real project files
    expect(container.map.size).toBeGreaterThan(0);

    // a real file that exists under cwd must be included
    const r01 = container.isInclude(
      posixJoin(process.cwd(), 'src/modules/scope/IncludeContainer.ts'),
    );
    expect(r01).toBeTruthy();
  });

  it('isInclude', () => {
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts', 'src/compilers/**/*.ts', 'examples/**/*.ts'] },
      cwd: process.cwd(),
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    const r02 = container.isInclude('src/cli/builders/setModeBundleOptions.ts');
    const r03 = container.isInclude(posixJoin(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isInclude(
      posixJoin(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
    );

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
  });

  it('with exclusive glob isInclude', () => {
    const container = new IncludeContainer({
      config: {
        include: [
          'src/cli/**/*.ts',
          'src/compilers/**/*.ts',
          '!src/compilers/getTypeScriptProject.ts',
          'examples/**/*.ts',
        ],
      },
      cwd: process.cwd(),
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    const r02 = container.isInclude('src/cli/builders/setModeBundleOptions.ts');
    const r03 = container.isInclude(posixJoin(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isInclude(
      posixJoin(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
    );
    const r05 = container.isInclude(
      posixJoin(process.cwd(), 'src/cli/compilers/getTypeScriptProject.ts'),
    );

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
    expect(r05).toBeFalsy();
  });

  it('isInclude - Windows-style backslash absolute path should be recognized', () => {
    // Regression test for Windows path separator bug.
    // On Windows, ts-morph returns paths like C:\project\src\foo.ts (backslashes).
    // IncludeContainer stores posix paths (C:/project/src/foo.ts) after replaceSepToPosix.
    // isInclude must normalize backslashes before map lookup; otherwise it always returns false.
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts'] },
      cwd: process.cwd(),
    });

    // Pick a real file that IS in the map (posix separator)
    const posixPath = Array.from(container.map.keys()).at(0);
    expect(posixPath).toBeDefined();

    // Simulate the Windows path that ts-morph would return on a Windows machine
    const windowsStylePath = toWindowsPath(posixPath!);

    // isInclude must return true — the file is included regardless of separator style
    expect(container.isInclude(windowsStylePath)).toBe(true);
  });

  it('isInclude - Windows-style backslash path must not match an excluded file', () => {
    // Even after normalizing separators, a file outside the include glob must not match.
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts'] },
      cwd: process.cwd(),
    });

    // A path that is NOT in the include pattern (src/modules, not src/cli)
    const posixPathNotIncluded = posixJoin(process.cwd(), 'src/modules/scope/IncludeContainer.ts');
    const windowsStylePath = toWindowsPath(posixPathNotIncluded);

    expect(container.isInclude(windowsStylePath)).toBe(false);
  });

  it('isInclude - relative Windows-style backslash path should be recognized', () => {
    // Regression test for relative paths with backslashes on Windows.
    // When filePath is relative (not absolute), isInclude calls posixResolve.
    // On Windows, path.resolve('src\\cli\\foo.ts') returns a proper Windows absolute path,
    // but posixResolve must then also normalize separators for the map lookup to succeed.
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts'] },
      cwd: process.cwd(),
    });

    // Simulate a relative Windows-style path (backslashes instead of forward slashes)
    const windowsRelativePath = 'src\\cli\\builders\\setModeBundleOptions.ts';

    // isInclude should resolve and normalize the path to match the map key
    expect(container.isInclude(windowsRelativePath)).toBe(true);
  });

  it('isInclude - returns false when map is empty (no files matched)', () => {
    const container = new IncludeContainer({
      config: { include: ['__nonexistent_dir_ctix_test__/**/*.ts'] },
      cwd: process.cwd(),
    });

    expect(container.map.size).toBe(0);
    expect(container.isInclude('src/modules/scope/IncludeContainer.ts')).toBe(false);
  });

  it('files - string path', () => {
    const expactation = getGlobFiles(
      new Glob('examples/type03/**/*.ts', {
        ignore: defaultExclude,
        cwd: process.cwd(),
        absolute: true,
      }),
    );
    const container = new IncludeContainer({
      config: { include: ['examples/type03/**/*.ts'] },
      cwd: process.cwd(),
    });

    const r01 = container.files();

    expect(r01).toEqual(expactation);
  });
});
