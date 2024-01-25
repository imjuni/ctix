import { getRelativeDepth } from '#/modules/path/getRelativeDepth';
import { describe, expect, it } from 'vitest';

describe('getRelativeDepth', () => {
  it('normal case, depth 3', () => {
    const r01 = getRelativeDepth('/1/2/3', '/1/2/3/4/5/6');
    expect(r01).toEqual(3);
  });

  it('same depth', () => {
    const r01 = getRelativeDepth('/1/2/3', '/1/2/3');
    expect(r01).toEqual(0);
  });

  it('same depth on root, but diff depth', () => {
    const r01 = getRelativeDepth('/1/2/3', '/1/2/4');
    expect(r01).toEqual(2);
  });

  it('exception', () => {
    expect(() => {
      getRelativeDepth(undefined as any, '/1/2/3');
    }).toThrowError();
  });
});
