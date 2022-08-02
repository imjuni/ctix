import { getRefineIgnorePath } from '@ignores/gitignore';

test('drive.char.test', () => {
  const testInputs = [
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
  ];

  const ret = testInputs.map((inp) => getRefineIgnorePath(inp));

  const expectation = [
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
  ];

  expect(ret).toEqual(expectation);
});
