import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import { getGenerationStyle } from '#/templates//modules/getGenerationStyle';
import { describe, expect, it } from 'vitest';

describe('getGenerationStyle', () => {
  it('pass', async () => {
    const r01 = getGenerationStyle(CE_GENERATION_STYLE.AUTO);
    const r02 = getGenerationStyle(CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE);
    const r03 = getGenerationStyle(CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR);
    const r04 = getGenerationStyle(CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE);
    const r05 = getGenerationStyle(CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE);
    const r06 = getGenerationStyle(CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR);

    expect(r01).toEqual(CE_GENERATION_STYLE.AUTO);
    expect(r02).toEqual(CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE);
    expect(r03).toEqual(CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR);
    expect(r04).toEqual(CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE);
    expect(r05).toEqual(CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE);
    expect(r06).toEqual(CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR);
  });
});
