import { ICreateTypeScriptIndex } from '@interfaces/IConfigObjectProps';
import { getConfigFiles, getCTIXOptions, getMergedConfig, defaultOption } from '@tools/cticonfig';
import debug from 'debug';
import { isLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TTE from 'fp-ts/lib/TaskEither';
import * as path from 'path';

const log = debug('ctix:config-test');
const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType03Path = path.join(exampleRootPath, 'type03');

describe('cti-config-test', () => {
  test('get-cti-config-files', async () => {
    const files = await getConfigFiles({ projectPath: path.join(exampleType03Path, 'tsconfig.json') });

    if (isLeft(files)) {
      return expect(isLeft(files)).toBeFalsy();
    }

    log('Result: ', files.right);

    const expection: ICreateTypeScriptIndex = {
      projectPath: path.join(exampleType03Path, 'tsconfig.json'),
      optionFiles: [
        path.join(exampleType03Path, '/.ctirc'),
        path.join(exampleType03Path, '/wellmade/.ctirc'),
        path.join(exampleType03Path, '/juvenile/spill/.ctirc'),
        path.join(exampleType03Path, '/wellmade/carpenter/.ctirc'),
      ],
    };

    return expect(files.right).toEqual(expection);
  });

  test('get-cti-config', async () => {
    const projectPath = path.join(exampleType03Path, 'tsconfig.json');
    const res = await getCTIXOptions({ projectPath });

    if (isLeft(res)) {
      return expect(isLeft(res)).toBeFalsy();
    }

    log('Result: ', res);

    return expect(res.right).toEqual([
      {
        dir: exampleType03Path,
        exists: true,
        depth: 0,
        option: {
          addNewline: true,
          quote: '"',
          useSemicolon: true,
          useTimestamp: true,
          verbose: true,
        },
      },
      {
        dir: path.join(exampleType03Path, '/juvenile'),
        exists: false,
        depth: 1,
        option: undefined,
      },
      {
        dir: path.join(exampleType03Path, '/wellmade'),
        exists: true,
        depth: 1,
        option: {
          addNewline: true,
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
        option: {
          addNewline: true,
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
        option: {
          addNewline: true,
          quote: "'",
          useSemicolon: true,
          useTimestamp: false,
          verbose: false,
        },
      },
    ]);
  });

  test('get-merged-content', async () => {
    const projectPath = path.join(exampleType03Path, 'tsconfig.json');

    const mergedConfig = await pipe(
      projectPath,
      (projectPath) => () => getCTIXOptions({ projectPath }),
      TTE.chain((args) => () =>
        getMergedConfig({
          projectPath,
          cliOption: defaultOption({ project: projectPath }),
          optionObjects: args,
        }),
      ),
    )();

    if (isLeft(mergedConfig)) {
      return expect(isLeft(mergedConfig)).toBeFalsy();
    }

    log(mergedConfig.right);
    log('working directory: ', process.cwd());

    return expect(mergedConfig.right.sort((l, r) => l.dir.localeCompare(r.dir))).toEqual(
      [
        {
          dir: exampleType03Path,
          exists: true,
          depth: 0,
          option: {
            addNewline: true,
            exportFilename: 'index.ts',
            project: projectPath,
            quote: "'",
            useBackupFile: true,
            useComment: true,
            useSemicolon: true,
            useTimestamp: false,
            verbose: false,
          },
        },
        {
          dir: exampleType03Path,
          exists: true,
          depth: 0,
          option: {
            addNewline: true,
            exportFilename: 'index.ts',
            project: projectPath,
            quote: "'",
            useBackupFile: true,
            useComment: true,
            useSemicolon: true,
            useTimestamp: false,
            verbose: false,
          },
        },
        {
          dir: path.join(exampleType03Path, '/juvenile'),
          exists: false,
          depth: 1,
          option: {
            addNewline: true,
            exportFilename: 'index.ts',
            project: projectPath,
            quote: "'",
            useBackupFile: true,
            useComment: true,
            useSemicolon: true,
            useTimestamp: false,
            verbose: false,
          },
        },
        {
          dir: path.join(exampleType03Path, '/wellmade'),
          exists: true,
          depth: 1,
          option: {
            addNewline: true,
            exportFilename: 'index.ts',
            project: projectPath,
            quote: "'",
            useBackupFile: true,
            useComment: true,
            useSemicolon: true,
            useTimestamp: false,
            verbose: false,
          },
        },
        {
          dir: path.join(exampleType03Path, '/juvenile/spill'),
          exists: true,
          depth: 2,
          option: {
            addNewline: true,
            exportFilename: 'index.ts',
            project: projectPath,
            quote: "'",
            useBackupFile: true,
            useComment: true,
            useSemicolon: true,
            useTimestamp: false,
            verbose: false,
          },
        },
        {
          dir: path.join(exampleType03Path, '/wellmade/carpenter'),
          exists: true,
          depth: 2,
          option: {
            addNewline: true,
            exportFilename: 'index.ts',
            project: projectPath,
            quote: "'",
            useBackupFile: true,
            useComment: true,
            useSemicolon: true,
            useTimestamp: false,
            verbose: false,
          },
        },
      ].sort((l, r) => l.dir.localeCompare(r.dir)),
    );
  });
});
