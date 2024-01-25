import { getAllParentDir } from '#/modules/path/getAllParentDir';
import { describe, expect, it } from 'vitest';

describe('getAllParentDir', () => {
  it('absolute multi depth path parent ', () => {
    const r01 = getAllParentDir('/1/2/3', '/1/2/3/4/5/6');
    expect(r01).toEqual(['/1/2/3', '/1/2/3/4', '/1/2/3/4/5']);
  });
});
