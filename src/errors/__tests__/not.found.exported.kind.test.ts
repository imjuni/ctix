import { NotFoundExportedKind } from '#/errors/NotFoundExportedKind';
import { randomUUID } from 'crypto';
import { atOrThrow } from 'my-easy-fp';
import pathe from 'pathe';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const tsconfigDirPath = pathe.join(process.cwd(), 'examples');
const tsconfigFilePath = pathe.join(tsconfigDirPath, 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigFilePath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigFilePath,
  }),
};

describe('NotFoundExportedKind', () => {
  it('constructor', () => {
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
    const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
    const exportedDeclaration = atOrThrow(exportedDeclarationsMap.get('default') ?? [], 0);

    const err = new NotFoundExportedKind(
      { line: 1, column: 1 },
      filename,
      exportedDeclaration,
      'test message',
    );

    expect(err).toBeTruthy();
  });

  it('getter and setter', () => {
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
    const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
    const exportedDeclaration = atOrThrow(exportedDeclarationsMap.get('default') ?? [], 0);

    const err = new NotFoundExportedKind(
      { line: 1, column: 1 },
      filename,
      exportedDeclaration,
      'test message',
    );

    expect(err.filePath).toEqual(filename);
    expect(err.pos).toEqual({ line: 1, column: 1 });
    expect(err.node).toBeTruthy();
  });

  it('create reason', () => {
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
    const exportedDeclarationsMap = sourceFile.getExportedDeclarations();
    const exportedDeclaration = atOrThrow(exportedDeclarationsMap.get('default') ?? [], 0);

    const err = new NotFoundExportedKind(
      { line: 1, column: 1 },
      filename,
      exportedDeclaration,
      'test message',
    );

    const reason = err.createReason();
    expect(reason).toMatchObject({
      type: 'error',
      lineAndCharacter: { line: 1, character: 1 },
      filePath: filename,
      message: "Cannot support export statement: (261) hero = 'ironman'",
    });
  });
});
