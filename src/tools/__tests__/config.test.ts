import { ICreateTypeScriptIndex } from '@interfaces/IConfigObjectProps';
import { getConfigFiles, getCtiConfig, getMergedConfig } from '@tools/cticonfig';
import debug from 'debug';
import { isLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TTE from 'fp-ts/lib/TaskEither';
import * as path from 'path';

const log = debug('ctit:config-test');
const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType03Path = path.join(exampleRootPath, 'type03');

describe('cti-config-test', () => {
  test('get-cti-config-files', async () => {
    const files = await getConfigFiles({ cwd: exampleType03Path });

    if (isLeft(files)) {
      return expect(isLeft(files)).toBeFalsy();
    }

    log('Result: ', files.right);

    const expection: ICreateTypeScriptIndex = {
      cwd: exampleType03Path,
      configFiles: [
        path.join(exampleType03Path, '/.ctirc'),
        path.join(exampleType03Path, '/wellmade/.ctirc'),
        path.join(exampleType03Path, '/juvenile/spill/.ctirc'),
        path.join(exampleType03Path, '/wellmade/carpenter/.ctirc'),
      ],
    };

    return expect(files.right).toEqual(expection);
  });

  test('get-cti-config', async () => {
    const res = await getCtiConfig({ cwd: exampleType03Path });

    if (isLeft(res)) {
      return expect(isLeft(res)).toBeFalsy();
    }

    log('Result: ', res);

    return expect(res.right).toEqual([
      {
        dir: exampleType03Path,
        exists: true,
        depth: 0,
        config: {
          addNewline: true,
          fileFirst: false,
          includeCWD: true,
          quote: "'",
          useSemicolon: true,
          useTimestamp: false,
          verbose: false,
        },
      },
      {
        dir: path.join(exampleType03Path, '/juvenile'),
        exists: false,
        depth: 1,
        config: undefined,
      },
      {
        dir: path.join(exampleType03Path, '/wellmade'),
        exists: true,
        depth: 1,
        config: {
          addNewline: true,
          fileFirst: false,
          includeCWD: true,
          quote: "'",
          useSemicolon: true,
          useTimestamp: false,
          verbose: false,
        },
      },
      {
        dir: path.join(exampleType03Path, '/juvenile/spill'),
        exists: true,
        depth: 2,
        config: {
          addNewline: true,
          fileFirst: false,
          includeCWD: true,
          quote: "'",
          useSemicolon: true,
          useTimestamp: false,
          verbose: false,
        },
      },
      {
        dir: path.join(exampleType03Path, '/wellmade/carpenter'),
        exists: true,
        depth: 2,
        config: {
          addNewline: true,
          fileFirst: false,
          includeCWD: true,
          quote: "'",
          useSemicolon: true,
          useTimestamp: false,
          verbose: false,
        },
      },
    ]);
  });

  test('get-merged-content', async () => {
    const mergedConfig = await pipe(
      exampleType03Path,
      (cwd) => () => getCtiConfig({ cwd }),
      TTE.chain((args) => () => getMergedConfig({ cwd: process.cwd(), configObjects: args })),
    )();

    if (isLeft(mergedConfig)) {
      return expect(isLeft(mergedConfig)).toBeFalsy();
    }

    log(mergedConfig.right);
    log('working directory: ', process.cwd());

    return expect(mergedConfig.right.sort()).toEqual(
      [
        {
          dir: exampleType03Path,
          exists: true,
          depth: 0,
          config: {
            addNewline: true,
            useSemicolon: true,
            useTimestamp: false,
            withoutComment: true,
            useDeclarationFile: false,
            quote: "'",
            verbose: false,
            withoutBackupFile: false,
            output: process.cwd(),
            project: path.join(process.cwd(), '/tsconfig.json'),
            fileFirst: false,
            includeCWD: true,
          },
        },
        {
          dir: exampleType03Path,
          exists: true,
          depth: 0,
          config: {
            addNewline: true,
            useSemicolon: true,
            useTimestamp: false,
            withoutComment: true,
            useDeclarationFile: false,
            quote: "'",
            verbose: false,
            withoutBackupFile: false,
            output: process.cwd(),
            project: path.join(process.cwd(), '/tsconfig.json'),
            fileFirst: false,
            includeCWD: true,
          },
        },
        {
          dir: path.join(exampleType03Path, '/juvenile'),
          exists: false,
          depth: 1,
          config: {
            addNewline: true,
            useSemicolon: true,
            useTimestamp: false,
            withoutComment: true,
            useDeclarationFile: false,
            quote: "'",
            verbose: false,
            withoutBackupFile: false,
            output: process.cwd(),
            project: path.join(process.cwd(), '/tsconfig.json'),
            fileFirst: false,
            includeCWD: true,
          },
        },
        {
          dir: path.join(exampleType03Path, '/wellmade'),
          exists: true,
          depth: 1,
          config: {
            addNewline: true,
            useSemicolon: true,
            useTimestamp: false,
            withoutComment: true,
            useDeclarationFile: false,
            quote: "'",
            verbose: false,
            withoutBackupFile: false,
            output: process.cwd(),
            project: path.join(process.cwd(), '/tsconfig.json'),
            fileFirst: false,
            includeCWD: true,
          },
        },
        {
          dir: path.join(exampleType03Path, '/juvenile/spill'),
          exists: true,
          depth: 2,
          config: {
            addNewline: true,
            useSemicolon: true,
            useTimestamp: false,
            withoutComment: true,
            useDeclarationFile: false,
            quote: "'",
            verbose: false,
            withoutBackupFile: false,
            output: process.cwd(),
            project: path.join(process.cwd(), '/tsconfig.json'),
            fileFirst: false,
            includeCWD: true,
          },
        },
        {
          dir: path.join(exampleType03Path, '/wellmade/carpenter'),
          exists: true,
          depth: 2,
          config: {
            addNewline: true,
            useSemicolon: true,
            useTimestamp: false,
            withoutComment: true,
            useDeclarationFile: false,
            quote: "'",
            verbose: false,
            withoutBackupFile: false,
            output: process.cwd(),
            project: path.join(process.cwd(), '/tsconfig.json'),
            fileFirst: false,
            includeCWD: true,
          },
        },
      ].sort(),
    );
  });
});
