import { addCurrentDirPrefix } from '#/modules/path/addCurrentDirPrefix';
import { describe, expect, it } from 'vitest';

describe('addCurrentDirPrefix', () => {
  it('skip path-sep', () => {
    const inp01 = 'ironman';
    const inp02 = './ironman';
    const inp03 = '../ironman';
    const inp04 = '../../ironman';
    const inp05 = './../ironman';
    const inp06 = '';

    const r01 = addCurrentDirPrefix(inp01);
    const r02 = addCurrentDirPrefix(inp02);
    const r03 = addCurrentDirPrefix(inp03);
    const r04 = addCurrentDirPrefix(inp04);
    const r05 = addCurrentDirPrefix(inp05);
    const r06 = addCurrentDirPrefix(inp06);

    expect(r01).toEqual('./ironman');
    expect(r02).toEqual('./ironman');
    expect(r03).toEqual('../ironman');
    expect(r04).toEqual('../../ironman');
    expect(r05).toEqual('./../ironman');
    expect(r06).toEqual('./');
  });

  it('custom path-sep', () => {
    const inp01 = 'ironman';
    const inp02 = '.\\ironman';
    const inp03 = '..\\ironman';
    const inp04 = '..\\..\\ironman';
    const inp05 = '.\\..\\ironman';

    const r01 = addCurrentDirPrefix(inp01, '\\');
    const r02 = addCurrentDirPrefix(inp02, '\\');
    const r03 = addCurrentDirPrefix(inp03, '\\');
    const r04 = addCurrentDirPrefix(inp04, '\\');
    const r05 = addCurrentDirPrefix(inp05, '\\');

    expect(r01).toEqual('.\\ironman');
    expect(r02).toEqual('.\\ironman');
    expect(r03).toEqual('..\\ironman');
    expect(r04).toEqual('..\\..\\ironman');
    expect(r05).toEqual('.\\..\\ironman');
  });
});
