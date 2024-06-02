import { getTsconfigComparer } from '#/configs/modules/getTsconfigComparer';
import { describe, expect, it } from 'vitest';

describe('getTsconfigComparer', () => {
  it('sort multi depth tsconfig', async () => {
    const comparer = getTsconfigComparer(process.cwd());
    const r01 = [
      'tsconfig.eslint.json',
      'tsconfig.dts.json',
      'examples/tsconfig.empty.json',
      'examples/type03/tsconfig.json',
      'tsconfig.prod.json',
      'examples/tsconfig.example.json',
      'tsconfig.json',
      'examples/tsconfig.for.test.json',
    ].sort(comparer);

    expect(r01).toEqual([
      'tsconfig.json',
      'tsconfig.dts.json',
      'tsconfig.eslint.json',
      'tsconfig.prod.json',
      'examples/tsconfig.empty.json',
      'examples/tsconfig.example.json',
      'examples/tsconfig.for.test.json',
      'examples/type03/tsconfig.json',
    ]);
  });

  it('right operand is tsconfig.json', async () => {
    const comparer = getTsconfigComparer(process.cwd());
    const r01 = [
      'tsconfig.json',
      'tsconfig.eslint.json',
      'tsconfig.dts.json',
      'examples/tsconfig.empty.json',
      'examples/type03/tsconfig.json',
      'tsconfig.prod.json',
      'examples/tsconfig.example.json',
      'examples/tsconfig.for.test.json',
    ].sort(comparer);

    expect(r01).toEqual([
      'tsconfig.json',
      'tsconfig.dts.json',
      'tsconfig.eslint.json',
      'tsconfig.prod.json',
      'examples/tsconfig.empty.json',
      'examples/tsconfig.example.json',
      'examples/tsconfig.for.test.json',
      'examples/type03/tsconfig.json',
    ]);
  });
});
