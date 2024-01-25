import { getParentDir } from '#/modules/path/getParentDir';
import { describe, expect, it } from 'vitest';

describe('getParentDir', () => {
  it('absolute multi depth path parent ', () => {
    const r01 = getParentDir('/1/2/3/4/5/6');
    expect(r01).toEqual('/1/2/3/4/5');
  });

  it('dot path with multi depth path parent ', () => {
    const r01 = getParentDir('./1/2/3/4/5/6');
    expect(r01).toEqual('./1/2/3/4/5');
  });

  it('one depth parent: parent', () => {
    const r01 = getParentDir('/1');
    expect(r01).toEqual('/');
  });

  it('no parent ', () => {
    const r01 = getParentDir('1');
    expect(r01).toBeUndefined();
  });

  it('relative ', () => {
    const r01 = getParentDir('./1');
    expect(r01).toEqual('.');
  });
});
