import { getExportAssignmentMap } from '#/compilers/getExportAssignmentMap';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { randomUUID } from 'crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const tsconfigDirPath = posixJoin(process.cwd(), 'examples');
const tsconfigFilePath = posixJoin(tsconfigDirPath, 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigFilePath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigFilePath,
  }),
};

describe('getExportAssignmentMap', () => {
  it('VariableDeclaration, VariableStatement > export default', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
const hero = 'ironman';

export default hero;

export function iamfunction() {
  return 'function';
}`.trim();
    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const map = getExportAssignmentMap(sourceFile);

    expect(map.get('hero')).toBeDefined();
  });

  it('ArrowFunction, VariableStatement > export default', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
const hero = () => {};

export default hero;

export function iamfunction() {
  return 'function';
}`.trim();
    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const map = getExportAssignmentMap(sourceFile);

    expect(map.get('hero')).toBeDefined();
  });

  it('FunctionDeclaration, VariableStatement > export default', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
const function hero() {};

export default hero;

export function iamfunction() {
  return 'function';
}`.trim();
    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const map = getExportAssignmentMap(sourceFile);

    expect(map.get('hero')).toBeDefined();
  });

  it('anomymous ArrowFunction, VariableStatement > export default', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
export default () => {};

export function iamfunction() {
  return 'function';
}`.trim();
    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const map = getExportAssignmentMap(sourceFile);

    expect(map.get('__default')).toBeDefined();
  });
});
