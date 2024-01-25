import { getFunctionName } from '#/compilers/getFunctionName';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

describe('getFunctionName', () => {
  it('arrow function', async () => {
    const r01 = getFunctionName(tsm.SyntaxKind.ArrowFunction, '__function');
    const r02 = getFunctionName(tsm.SyntaxKind.ArrowFunction, 'hello');
    const r03 = getFunctionName(tsm.SyntaxKind.ArrowFunction);

    expect(r01).toBeUndefined();
    expect(r02).toEqual('hello');
    expect(r03).toBeUndefined();
  });

  it('function', async () => {
    const r01 = getFunctionName(tsm.SyntaxKind.FunctionDeclaration, 'hello');
    const r02 = getFunctionName(tsm.SyntaxKind.FunctionDeclaration);

    expect(r01).toEqual('hello');
    expect(r02).toBeUndefined();
  });

  it('not function', async () => {
    const r01 = getFunctionName(tsm.SyntaxKind.VariableStatement, 'hello');
    expect(r01).toBeUndefined();
  });
});
