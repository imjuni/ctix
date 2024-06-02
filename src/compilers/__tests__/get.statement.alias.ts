import { getStatementAlias } from '#/compilers/getStatementAlias';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

describe('getStatementAlias', () => {
  it('default export, no alias', () => {
    const name = getStatementAlias({
      alias: undefined,
      filenamified: 'filename',
      isDefault: true,
      kind: {
        name: 'iamdefault',
        isPureType: false,
        kind: tsm.SyntaxKind.InterfaceDeclaration,
      },
    });

    expect(name).toEqual('iamdefault');
  });

  it('named export, has alias', () => {
    const name = getStatementAlias({
      alias: 'iamalias',
      filenamified: 'filename',
      isDefault: false,
      kind: {
        name: 'iamdefault',
        isPureType: false,
        kind: tsm.SyntaxKind.InterfaceDeclaration,
      },
    });

    expect(name).toEqual('iamalias');
  });

  it('named export, has not alias', () => {
    const name = getStatementAlias({
      alias: undefined,
      filenamified: 'filename',
      isDefault: false,
      kind: {
        name: 'iamdefault',
        isPureType: false,
        kind: tsm.SyntaxKind.InterfaceDeclaration,
      },
    });

    expect(name).toEqual('filename');
  });
});
