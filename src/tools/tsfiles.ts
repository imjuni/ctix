import debug from 'debug';
import * as TE from 'fp-ts/lib/Either';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import path from 'path';
import typescript from 'typescript';
import { exists } from './misc';
import { delintNode } from './tstools';
import { TResolvedEither, TResolvedPromise } from './typehelper';

const log = debug('ctit:ignore-tool');

/**
 * tsconfig.json file find in current working director or cli execute path
 *
 * @param cwd current working directory, target directory from cli or passed
 * @param filename tsconfig.json filename. If you want to use tsconfig.prod.json or etc, use it.
 */
export async function getTypeScriptConfig({
  cwd,
  tsconfigPath: tsconfigPathFrom,
}: {
  cwd: string;
  tsconfigPath?: string;
}): Promise<TE.Either<Error, typescript.ParsedCommandLine>> {
  try {
    const cliPath = process.cwd();
    const tsconfigInCliPath = path.join(cliPath, 'tsconfig.json');
    const tsconfigResolved = isNotEmpty(tsconfigPathFrom)
      ? path.resolve(tsconfigPathFrom)
      : path.resolve(tsconfigInCliPath);

    const tsconfigPath = (await exists(tsconfigResolved))
      ? tsconfigResolved
      : (await exists(tsconfigInCliPath))
      ? path.join(cliPath, tsconfigResolved)
      : undefined;

    if (isEmpty(tsconfigPath)) {
      return TE.left(new Error(`Cannot found ${tsconfigResolved} in ${cwd} or ${cliPath}`));
    }

    const parseConfigHost: typescript.ParseConfigHost = {
      fileExists: typescript.sys.fileExists,
      readFile: typescript.sys.readFile,
      readDirectory: typescript.sys.readDirectory,
      useCaseSensitiveFileNames: true,
    };

    const configFile = typescript.readConfigFile(tsconfigPath, typescript.sys.readFile);

    const tsconfig = typescript.parseJsonConfigFileContent(
      configFile.config,
      parseConfigHost,
      path.dirname(tsconfigPath),
    );

    // typescript.ParsedCommandLine object already contains typescript file in project
    log('tsconfig filenames: ', tsconfig.fileNames);

    return TE.right(tsconfig);
  } catch (err) {
    return TE.left(err);
  }
}

export async function getTypeScriptSource({
  tsconfig,
  ignores,
}: {
  tsconfig: TResolvedEither<TResolvedPromise<ReturnType<typeof getTypeScriptConfig>>>;
  ignores: string[];
}): Promise<TE.Either<Error, { program: typescript.Program; filenames: string[] }>> {
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
      return TE.left(new Error('invalid source file'));
    }

    return TE.right({ program, filenames });
  } catch (err) {
    return TE.left(err);
  }
}

export async function getTypeScriptExportStatement({
  program,
  filenames,
}: {
  program: typescript.Program;
  filenames: string[];
}) {
  try {
    const typescriptFileMap = new Map(filenames.map((filename) => [filename, true]));

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
      .map((source) =>
        source.export.map((exported) => ({ filename: source.filename, exported })),
      )
      .flatMap((source) => source)
      .map((source) => source.filename)
      .filter((filename): filename is string => isNotEmpty(filename));

    const exportSet = new Set(exportFilenames);
    const exportsDeduped = Array.from(exportSet);

    const defaultExportFilenames = sources
      .map((source) =>
        source.default.map((defaulted) => ({
          filename: source.filename,
          defaulted,
        })),
      )
      .flatMap((source) => source)
      .map((source) => source.filename);

    const defaultSet = new Set(defaultExportFilenames);
    const defaultsDeduped = Array.from(defaultSet);

    log('익스포트: ', exportFilenames, ' 디폴트: ', defaultExportFilenames);

    return TE.right({
      exportFilenames: exportsDeduped,
      defaultExportFilenames: defaultsDeduped,
    });
  } catch (err) {
    return TE.left(err);
  }
}
