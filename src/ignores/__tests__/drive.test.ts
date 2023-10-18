import { getRefineIgnorePath } from '#/ignores/getRefineIgnorePath';
import os from 'os';

test('drive.char.test', () => {
  const testInputs =
    os.platform() === 'win32'
      ? [
          // Uppercase of drive character
          'F:/project/node/github/erdia/src/cli/initSample.ts',
          'F:/project/node/github/erdia/src/cli',
          'f:/project/node/github/erdia/src/cli/initSample.ts',
          'f:/project/node/github/erdia/src/cli',

          // Lowercase of drive character
          'f:/project/node/github/erdia/src/cli/initSample.ts',
          'f:/project/node/github/erdia/src/cli',
          'f:/project/node/github/erdia/src/cli/initSample.ts',
          'f:/project/node/github/erdia/src/cli',

          // Posix style Path
          '/project/node/github/erdia/src/cli/initSample.ts',
          '/project/node/github/erdia/src/cli',
          '/project/node/github/erdia/src/cli/initSample.ts',
          '/project/node/github/erdia/src/cli',

          // Posix style Path
          '/initSample.ts',
          'initSample.ts',
          '/cli',
          'cli',
        ]
      : [
          // Posix style Path
          '/project/node/github/erdia/src/cli/initSample.ts',
          '/project/node/github/erdia/src/cli',
          '/project/node/github/erdia/src/cli/initSample.ts',
          '/project/node/github/erdia/src/cli',

          // Posix style Path
          '/initSample.ts',
          'initSample.ts',
          '/cli',
          'cli',
        ];

  const ret = testInputs.map((inp) => getRefineIgnorePath(inp));

  const expectation =
    os.platform() === 'win32'
      ? [
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'initSample.ts',
          'initSample.ts',
          'cli',
          'cli',
        ]
      : [
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'project/node/github/erdia/src/cli/initSample.ts',
          'project/node/github/erdia/src/cli',
          'initSample.ts',
          'initSample.ts',
          'cli',
          'cli',
        ];

  expect(ret).toEqual(expectation);
});
