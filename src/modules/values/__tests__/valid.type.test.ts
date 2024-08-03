import { getCheckedValue } from '#/modules/values/getCheckedValue';
import { describe, expect, it } from 'vitest';

describe('getValidValue', () => {
  it('variety case', () => {
    const r01 = getCheckedValue('Number', 1);
    const r02 = getCheckedValue('Number', '1');
    const r03 = getCheckedValue('String', 'hello');
    const r04 = getCheckedValue('String', 1);
    const r05 = getCheckedValue('String', undefined);

    console.log(r01, r02, r03, r04);

    expect(r01).toEqual(1);
    expect(r02).toBeUndefined();
    expect(r03).toEqual('hello');
    expect(r04).toBeUndefined();
    expect(r05).toBeUndefined();
  });
});
