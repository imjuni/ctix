import { getInheritedFileScope } from '#/compilers/getInheritedFileScope';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { describe, expect, it } from 'vitest';

const examplesDir = posixJoin(process.cwd(), 'examples');

describe('getInheritedFileScope', () => {
  it('returns include and exclude directly declared in the file', () => {
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.base.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual(['src/**/*.ts', 'src/**/*.vue']);
    expect(result.exclude).toEqual(['dist/**', 'node_modules/**']);
  });

  it('inherits include from base when child has no include', () => {
    // tsconfig.inherit.mid.json extends base and has only exclude
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.mid.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual(['src/**/*.ts', 'src/**/*.vue']);
    expect(result.exclude).toEqual(['dist/**', 'node_modules/**', '**/*.test.ts']);
  });

  it('traverses two levels to find include', () => {
    // tsconfig.inherit.leaf.json → mid (no include) → base (has include)
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.leaf.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual(['src/**/*.ts', 'src/**/*.vue']);
    expect(result.exclude).toEqual(['dist/**', 'node_modules/**', '**/*.test.ts']);
  });

  it('child include overrides base include', () => {
    // tsconfig.inherit.override.json extends base but declares its own include
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.override.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual(['src/**/*.ts']);
    expect(result.exclude).toEqual(['dist/**', 'node_modules/**']);
  });

  it('returns empty arrays when no include or exclude found in chain', () => {
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.empty.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual([]);
    expect(result.exclude).toEqual([]);
  });

  it('returns only exclude when chain has no include', () => {
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.no-include.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual([]);
    expect(result.exclude).toEqual(['dist/**']);
  });

  it('does not loop infinitely on a non-existent extends target', () => {
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.base.json');
    // base has no extends, so traversal stops after one file
    const result = getInheritedFileScope(tsconfigPath);

    expect(result).toBeDefined();
  });

  it('handles array extends (TypeScript 5.0+) and inherits include from the first entry', () => {
    // tsconfig.inherit.array-extends.json: { "extends": ["./tsconfig.inherit.base.json"] }
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.array-extends.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual(['src/**/*.ts', 'src/**/*.vue']);
    expect(result.exclude).toEqual(['dist/**', 'node_modules/**']);
  });

  it('resolves extends path that omits the .json extension', () => {
    // tsconfig.inherit.no-ext.json: { "extends": "./tsconfig.inherit.base" }
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.no-ext.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual(['src/**/*.ts', 'src/**/*.vue']);
    expect(result.exclude).toEqual(['dist/**', 'node_modules/**']);
  });

  it('stops traversal when extends array contains a non-string entry', () => {
    // tsconfig.inherit.invalid-extends.json: { "extends": [123], "include": [...] }
    // has its own include, but extends[0] is a number → traversal stops before following parent
    const tsconfigPath = posixJoin(examplesDir, 'tsconfig.inherit.invalid-extends.json');
    const result = getInheritedFileScope(tsconfigPath);

    expect(result.include).toEqual(['src/**/*.ts']);
    expect(result.exclude).toEqual([]);
  });
});
