import { getConfigObject } from '#/configs/getConfigObject';
import { getConfigValue } from '#/configs/getConfigValue';
import { describe, expect, it } from 'vitest';

describe('getConfigValue', () => {
  it('not key', async () => {
    const r01 = getConfigValue({ a: '/a/b/c' });
    expect(r01).toBeUndefined();
  });

  it('not found key', async () => {
    const r01 = getConfigValue({ a: '/a/b/c' }, 'p');
    expect(r01).toBeUndefined();
  });

  it('pick value string type', async () => {
    const r01 = getConfigValue({ p: '/a/b/c' }, 'p', 'project');
    const r02 = getConfigValue({ project: '/a/b/c' }, 'p', 'project');

    expect(r01).toEqual('/a/b/c');
    expect(r02).toEqual('/a/b/c');
  });

  it('pick value non string type', async () => {
    const r01 = getConfigValue({ p: 1 }, 'p', 'project');
    const r02 = getConfigValue({ project: true }, 'p', 'project');

    expect(r01).toBeUndefined();
    expect(r02).toBeUndefined();
  });
});

describe('getConfigObject', () => {
  it('key more then one', () => {
    const obj = getConfigObject({ a: 'a', b: 'b', c: 'c' }, 'a', 'c');
    expect(obj).toMatchObject({ a: 'a', c: 'c' });
  });

  it('empty keys', () => {
    const obj = getConfigObject({ a: 'a', b: 'b', c: 'c' }, 'z');
    expect(obj).toBeUndefined();
  });

  it('hit two keys, but undefined value', () => {
    const obj = getConfigObject({ a: 'a', b: 'b', c: 'c', d: undefined, e: undefined }, 'd', 'e');
    expect(obj).toBeUndefined();
  });
});
