import { getConfigValue } from '#/configs/getConfigValue';
import { describe, expect, it, vitest } from 'vitest';

vitest.mock('my-node-fp', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('my-node-fp')>();
  return {
    ...mod,
  };
});

// ---------------------------------------------------------------------------------------------
// getConfigValue
// ---------------------------------------------------------------------------------------------
describe('getConfigValue', () => {
  it('character c, string type', () => {
    const configPath = 'i-am-c';
    const input = { $0: '', c: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toEqual(configPath);
  });

  it("character c, don't string type", () => {
    const configPath = {};
    const input = { $0: '', c: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toBeUndefined();
  });

  it('character config, string type', () => {
    const configPath = 'i-am-config';
    const input = { $0: '', config: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toEqual(configPath);
  });

  it("character config, don't string type", () => {
    const configPath = {};
    const input = { $0: '', config: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toBeUndefined();
  });

  it('empty keys', () => {
    const configPath = {};
    const input = { $0: '', config: configPath };
    const data = getConfigValue(input);

    expect(data).toBeUndefined();
  });
});
