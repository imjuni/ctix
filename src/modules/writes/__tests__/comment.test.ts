import { getBanner } from '#/modules/writes/getBanner';
import dayjs from 'dayjs';
import { beforeAll, describe, expect, it, vitest } from 'vitest';

const testTimestamp = '2023-10-11T11:22:33.000';

describe('getBanner', () => {
  beforeAll(() => {
    vitest.useFakeTimers().setSystemTime(new Date(testTimestamp));
  });

  it('only use banner', async () => {
    const comment = getBanner(
      {
        useBanner: true,
        useTimestamp: false,
      },
      dayjs(testTimestamp),
    );

    expect(comment).toEqual('// created from ctix');
  });

  it('use banner and timestamp', async () => {
    const comment = getBanner(
      {
        useBanner: true,
        useTimestamp: true,
      },
      dayjs(testTimestamp),
    );

    expect(comment).toEqual('// created from ctix 2023-10-11 11:22:33');
  });

  it('not pass today', async () => {
    const comment = getBanner({ useBanner: true, useTimestamp: true });

    expect(comment).toBeDefined();
  });

  it('no banner', async () => {
    const comment = getBanner({
      useBanner: false,
      useTimestamp: false,
    });

    expect(comment).toBeUndefined();
  });
});
