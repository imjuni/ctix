import { getCwd } from '#/modules/path/getCwd';
import { afterEach, describe, expect, it } from 'vitest';

describe('getCwd', () => {
  afterEach(() => {
    delete process.env.USE_INIT_CWD;
    delete process.env.INIT_CWD;
  });

  it('returns process.cwd() when USE_INIT_CWD is not set', () => {
    delete process.env.USE_INIT_CWD;
    expect(getCwd()).toBe(process.cwd());
  });

  it('returns INIT_CWD when USE_INIT_CWD is "true" and INIT_CWD is set', () => {
    process.env.USE_INIT_CWD = 'true';
    process.env.INIT_CWD = '/some/init/cwd';

    expect(getCwd()).toBe('/some/init/cwd');
  });

  it('returns process.cwd() when USE_INIT_CWD is "true" but INIT_CWD is not set', () => {
    process.env.USE_INIT_CWD = 'true';
    delete process.env.INIT_CWD;

    expect(getCwd()).toBe(process.cwd());
  });

  it('returns process.cwd() when USE_INIT_CWD is not "true"', () => {
    process.env.USE_INIT_CWD = 'false';
    process.env.INIT_CWD = '/some/init/cwd';

    expect(getCwd()).toBe(process.cwd());
  });
});
