import { getCommentsWithParent } from '#/comments/getCommentsWithParent';
import { getNodeComments } from '#/comments/getNodeComments';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { randomUUID } from 'crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it, vitest } from 'vitest';

const tsconfigDirPath = posixJoin(process.cwd(), 'examples');
const tsconfigFilePath = posixJoin(tsconfigDirPath, 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigFilePath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigFilePath,
  }),
};

describe('getCommentsWithParent', () => {
  it('parent comment detected', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
export const name = 'ironman';

export function iamfunction() {
  return 'function';
}`.trim();

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedMap = sourceFile.getExportedDeclarations();

    const nameNode = exportedMap.get('name')?.at(0);

    const comments = nameNode != null ? getCommentsWithParent(nameNode) : [];

    expect(comments.at(0)?.getText()).toEqual(
      `/**
 * Some Detail Comment
 */`.trim(),
    );
    expect(comments.at(1)?.getText()).toEqual(`/** @ctix-exclude-next */`.trim());
  });

  it('cannot found parent', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
export const name = 'ironman';

export function iamfunction() {
  return 'function';
}`.trim();

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedMap = sourceFile.getExportedDeclarations();
    const nameNode = exportedMap.get('name')?.at(0);

    if (nameNode == null) {
      throw new Error('unknown error raised');
    }

    const spyHandle = vitest.spyOn(nameNode, 'getParent').mockImplementation(() => {
      return undefined;
    });

    const comments = getCommentsWithParent(nameNode);
    spyHandle.mockRestore();
    expect(comments.length).toEqual(0);
  });
});

describe('getNodeComments', () => {
  it('variable with VariableDeclarationList, VariableStatement', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
export const name = 'ironman';

export function iamfunction() {
  return 'function';
}`.trim();

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedMap = sourceFile.getExportedDeclarations();

    const nameNode = exportedMap.get('name')?.at(0);
    const functionNode = exportedMap.get('iamfunction')?.at(0);
    const comments = nameNode != null ? getNodeComments(nameNode) : [];
    const functionNodeComments = functionNode != null ? getNodeComments(functionNode) : [];

    expect(functionNodeComments.length).toEqual(0);

    expect(comments.at(0)).toMatchObject({
      range: '/**\n * Some Detail Comment\n */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });

    expect(comments.at(1)).toMatchObject({
      range: '/** @ctix-exclude-next */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });
  });

  it('function with VariableDeclarationList, VariableStatement', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

export const name = 'ironman';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
export function iamfunction() {
  return 'function';
}`.trim();

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedMap = sourceFile.getExportedDeclarations();

    const nameNode = exportedMap.get('name')?.at(0);
    const functionNode = exportedMap.get('iamfunction')?.at(0);
    const comments = functionNode != null ? getNodeComments(functionNode) : [];
    const nameNodeComments = nameNode != null ? getNodeComments(nameNode) : [];

    expect(nameNodeComments.length).toEqual(0);

    expect(comments.at(0)).toMatchObject({
      range: '/**\n * Some Detail Comment\n */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });

    expect(comments.at(1)).toMatchObject({
      range: '/** @ctix-exclude-next */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });
  });

  it('export default, VariableDeclarationList, VariableStatement', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

const name = 'ironman';

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
export default name;

export function iamfunction() {
  return 'function';
}`.trim();

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedMap = sourceFile.getExportedDeclarations();

    const nameNode = exportedMap.get('default')?.at(0);
    const nameNodeComments = nameNode != null ? getNodeComments(nameNode, 'name') : [];

    expect(nameNodeComments.at(0)).toMatchObject({
      range: '/**\n * Some Detail Comment\n */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });

    expect(nameNodeComments.at(1)).toMatchObject({
      range: '/** @ctix-exclude-next */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });
  });

  it('export default, ArrowFunction, VariableStatement', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/** @ctix-generation-style default-alias-named-destructive */
import path from 'node:path';

const greeting = () => {};

/**
 * Some Detail Comment
 */
/** @ctix-exclude-next */
export default greeting;

export function iamfunction() {
  return 'function';
}`.trim();

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const exportedMap = sourceFile.getExportedDeclarations();

    const nameNode = exportedMap.get('default')?.at(0);
    const nameNodeComments = nameNode != null ? getNodeComments(nameNode, 'greeting') : [];

    expect(nameNodeComments.at(0)).toMatchObject({
      range: '/**\n * Some Detail Comment\n */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });

    expect(nameNodeComments.at(1)).toMatchObject({
      range: '/** @ctix-exclude-next */',
      filePath: posixJoin(process.cwd(), filename),
      kind: 3,
    });
  });
});
