import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import * as TTE from 'fp-ts/TaskEither';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import path from 'path';
import typescript from 'typescript';
import { exists, replaceSepToPosix, winify } from './misc';
import { delintNode } from './tstools';
import { TResolvedTaskEither } from './typehelper';

const log = debug('ctix:tsfiles');

const getTsconfigPath =
  ({
    cwd,
    cliPath,
    tsconfigResolved,
    tsconfigInCliPath,
  }: {
    cwd: string;
    cliPath: string;
    tsconfigResolved: string;
    tsconfigInCliPath: string;
  }): TTE.TaskEither<Error, string> =>
  async () => {
    if (await exists(tsconfigResolved)) {
      return TEI.right(tsconfigResolved);
    }

    if (await exists(tsconfigInCliPath)) {
      return TEI.right(path.join(cliPath, tsconfigResolved));
    }

    return TEI.left(new Error(`Cannot found ${tsconfigResolved} in ${cwd} or ${cliPath}`));
  };

/**
 * tsconfig.json file find in current working director or cli execute path
 *
 * @param cwd current working directory, target directory from cli or passed
 * @param filename tsconfig.json filename. If you want to use tsconfig.prod.json or etc, use it.
 */
export const getTypeScriptConfig =
  ({
    cwd,
    tsconfigPath: tsconfigPathFrom,
  }: {
    cwd: string;
    tsconfigPath?: string;
  }): TTE.TaskEither<Error, typescript.ParsedCommandLine> =>
  async () => {
    try {
      const cliPath = process.cwd();
      const tsconfigInCliPath = path.join(cliPath, 'tsconfig.json');
      const tsconfigResolved = isNotEmpty(tsconfigPathFrom)
        ? path.resolve(tsconfigPathFrom)
        : path.resolve(tsconfigInCliPath);

      const tsconfigPath = await TFU.flow(
        () => ({ cwd, cliPath, tsconfigInCliPath, tsconfigResolved }),
        getTsconfigPath,
      )()();

      if (TEI.isLeft(tsconfigPath)) {
        return TEI.left(new Error(`Cannot found ${tsconfigResolved} in ${cwd} or ${cliPath}`));
      }

      const parseConfigHost: typescript.ParseConfigHost = {
        fileExists: typescript.sys.fileExists,
        readFile: typescript.sys.readFile,
        readDirectory: typescript.sys.readDirectory,
        useCaseSensitiveFileNames: true,
      };

      const configFile = typescript.readConfigFile(tsconfigPath.right, typescript.sys.readFile);

      const tsconfig = typescript.parseJsonConfigFileContent(
        configFile.config,
        parseConfigHost,
        path.dirname(tsconfigPath.right),
      );

      // typescript.ParsedCommandLine object already contains typescript file in project
      log('tsconfig filenames: ', tsconfig.fileNames);

      return TEI.right(tsconfig);
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');

      return TEI.left(err);
    }
  };

export const getTypeScriptSource =
  ({
    tsconfig,
    ignores,
  }: {
    tsconfig: TResolvedTaskEither<ReturnType<typeof getTypeScriptConfig>>;
    ignores: string[];
  }): TTE.TaskEither<Error, { program: typescript.Program; filenames: string[] }> =>
  async () => {
    try {
      const ignoreMap = new Map<string, boolean>(
        ignores
          .map((ignore) => path.resolve(ignore))
          .map((resolvedIgnore) => [resolvedIgnore, true]),
      );

      // Exclude exclude file in .ctiignore file: more exclude progress
      const filenames = tsconfig.fileNames
        .map((filename) => path.resolve(filename))
        .filter((filename) => isFalse(ignoreMap.get(filename) ?? false));

      log('typescript configed files: ', tsconfig.fileNames);
      log('typescript process ignored files: ', filenames);

      const program = typescript.createProgram(filenames, tsconfig.options);

      if (isEmpty(program)) {
        return TEI.left(new Error('invalid source file'));
      }

      return TEI.right({ program, filenames });
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');

      return TEI.left(err);
    }
  };

export async function getTypeScriptExportStatement({
  program,
  filenames,
}: {
  program: typescript.Program;
  filenames: string[];
}) {
  try {
    // typescript compiler contain filename unixify path, need convert win32 path to unixify path
    const typescriptFileMap = new Map(
      filenames.map((filename) => [replaceSepToPosix(filename), true]),
    );

    const sources = await Promise.all(
      program
        .getSourceFiles()
        .filter((source) => typescriptFileMap.get(source.fileName) ?? false)
        .map((source) =>
          source.statements.map((statement) =>
            delintNode({ filename: source.fileName, source: statement }),
          ),
        )
        .flatMap((source) => source),
    );

    const exportFilenames = sources
      .map((source) => source.export.map((exported) => ({ filename: source.filename, exported })))
      .flatMap((source) => source)
      .map((source) => source.filename)
      .filter((filename): filename is string => isNotEmpty(filename))
      .map((filename) => winify(filename));

    const exportSet = new Set(exportFilenames);
    const exportsDeduped = Array.from(exportSet).sort((left, right) => left.localeCompare(right));

    const defaultExportFilenames = sources
      .map((source) =>
        source.default.map((defaulted) => ({
          filename: source.filename,
          defaulted,
        })),
      )
      .flatMap((source) => source)
      .map((source) => source.filename)
      .map((filename) => winify(filename));

    const defaultSet = new Set(defaultExportFilenames);
    const defaultsDeduped = Array.from(defaultSet).sort((left, right) => left.localeCompare(right));

    log('file: ', filenames);
    log('export file: ', exportFilenames, ' default file: ', defaultExportFilenames);

    return TEI.right({
      exportFilenames: exportsDeduped,
      defaultExportFilenames: defaultsDeduped,
    });
  } catch (err) {
    return TEI.left(err);
  }
}
