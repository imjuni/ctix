import { getTsconfigComparer } from '#/configs/modules/getTsconfigComparer';
import { describe, expect, it } from 'vitest';

describe('getTsconfigComparer', () => {
  it('sort multi depth tsconfig', async () => {
    const comparer = getTsconfigComparer(process.cwd());
    const r01 = [
      'tsconfig.eslint.json',
      'tsconfig.dts.json',
      'example/tsconfig.empty.json',
      'example/type03/tsconfig.json',
      'tsconfig.prod.json',
      'example/tsconfig.example.json',
      'tsconfig.json',
      'example/tsconfig.for.test.json',
    ].sort(comparer);

    expect(r01).toEqual([
      'tsconfig.json',
      'tsconfig.dts.json',
      'tsconfig.eslint.json',
      'tsconfig.prod.json',
      'example/tsconfig.empty.json',
      'example/tsconfig.example.json',
      'example/tsconfig.for.test.json',
      'example/type03/tsconfig.json',
    ]);
  });

  it('right operand is tsconfig.json', async () => {
    const comparer = getTsconfigComparer(process.cwd());
    const r01 = [
      'tsconfig.json',
      'tsconfig.eslint.json',
      'tsconfig.dts.json',
      'example/tsconfig.empty.json',
      'example/type03/tsconfig.json',
      'tsconfig.prod.json',
      'example/tsconfig.example.json',
      'example/tsconfig.for.test.json',
    ].sort(comparer);

    expect(r01).toEqual([
      'tsconfig.json',
      'tsconfig.dts.json',
      'tsconfig.eslint.json',
      'tsconfig.prod.json',
      'example/tsconfig.empty.json',
      'example/tsconfig.example.json',
      'example/tsconfig.for.test.json',
      'example/type03/tsconfig.json',
    ]);
  });
});
