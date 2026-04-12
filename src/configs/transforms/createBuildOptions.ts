import { ProgressBar } from '#/cli/ux/ProgressBar';
import { Reasoner } from '#/cli/ux/Reasoner';
import { Spinner } from '#/cli/ux/Spinner';
import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandBuildOptions } from '#/configs/interfaces/TCommandBuildOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { getOutputValue } from '#/configs/transforms/getOutputValue';
import { transformBundleMode } from '#/configs/transforms/transformBundleMode';
import { transformCreateMode } from '#/configs/transforms/transformCreateMode';
import { transformModuleMode } from '#/configs/transforms/transformModuleMode';
import { getTsExcludeFiles } from '#/modules/file/getTsExcludeFiles';
import { getTsIncludeFiles } from '#/modules/file/getTsIncludeFiles';
import { getCwd } from '#/modules/path/getCwd';
import { toArray } from 'my-easy-fp';
import path from 'node:path';
import type { ArgumentsCamelCase } from 'yargs';

export async function createBuildOptions(
  argv: ArgumentsCamelCase<TCommandBuildArgvOptions> & {
    options?: (TCreateOptions | TBundleOptions)[];
    from?: string;
  },
): Promise<TCommandBuildOptions> {
  const options: TCommandBuildOptions & { from: string } = {
    $kind: CE_CTIX_COMMAND.BUILD_COMMAND,
    config: argv.config,
    from: argv.from ?? 'none',
    spinnerStream: argv.spinnerStream,
    progressStream: argv.progressStream,
    reasonerStream: argv.reasonerStream,
    verbose: argv.verbose ?? false,
    options: [],
  };

  if ('from' in argv && argv.from != null && typeof argv.from === 'string') {
    options.from = argv.from;
  }

  Spinner.it.stream = argv.spinnerStream;
  ProgressBar.it.stream = argv.progressStream;
  Reasoner.it.stream = argv.reasonerStream;

  // config 파일을 읽은 다음, options 필드가 존재하는 경우 argv.include, argv.exclude는 무시된다
  // After reading the config file, argv.include, argv.exclude are excluded if the options field is present
  if (argv.options != null) {
    options.options = argv.options;

    options.options = await Promise.all(
      options.options.map(async (option) => {
        if (option.mode === CE_CTIX_BUILD_MODE.MODULE_MODE) {
          const projectPath = path.resolve(getCwd(), option.project);
          const tsconfig = getTypeScriptConfig(projectPath);

          const moduleMode = await transformModuleMode(
            { ...argv, project: projectPath },
            {
              ...option,
              include: getTsIncludeFiles({
                config: { include: option.include },
                extend: {
                  tsconfig,
                  resolved: {
                    projectDirPath: path.dirname(projectPath),
                    projectFilePath: projectPath,
                  },
                },
              }),
              exclude: getTsExcludeFiles({
                config: { exclude: option.exclude },
                extend: {
                  tsconfig,
                  resolved: {
                    projectDirPath: path.dirname(projectPath),
                    projectFilePath: projectPath,
                  },
                },
              }),
            },
          );

          return moduleMode;
        }

        if (option.mode === CE_CTIX_BUILD_MODE.CREATE_MODE) {
          const projectPath = path.resolve(getCwd(), option.project);
          const tsconfig = getTypeScriptConfig(projectPath);

          const createMode = await transformCreateMode(
            { ...argv, project: projectPath },
            {
              ...option,
              include: getTsIncludeFiles({
                config: { include: option.include },
                extend: {
                  tsconfig,
                  resolved: {
                    projectDirPath: path.dirname(projectPath),
                    projectFilePath: projectPath,
                  },
                },
              }),
              exclude: getTsExcludeFiles({
                config: { exclude: option.exclude },
                extend: {
                  tsconfig,
                  resolved: {
                    projectDirPath: path.dirname(projectPath),
                    projectFilePath: projectPath,
                  },
                },
              }),
            },
          );

          return createMode;
        }

        const projectPath = path.resolve(getCwd(), option.project);
        const tsconfig = getTypeScriptConfig(projectPath);

        const bundleMode = transformBundleMode(
          { ...argv, project: projectPath },
          {
            ...option,
            include: getTsIncludeFiles({
              config: { include: option.include },
              extend: {
                tsconfig,
                resolved: {
                  projectDirPath: path.dirname(projectPath),
                  projectFilePath: projectPath,
                },
              },
            }),
            exclude: getTsExcludeFiles({
              config: { exclude: option.exclude },
              extend: {
                tsconfig,
                resolved: {
                  projectDirPath: path.dirname(projectPath),
                  projectFilePath: projectPath,
                },
              },
            }),
          },
        );
        return bundleMode;
      }),
    );

    return options;
  }

  const projectPath = path.resolve(getCwd(), argv.project);
  const tsconfig = getTypeScriptConfig(projectPath);

  const include =
    argv.include != null
      ? toArray(argv.include)
      : getTsIncludeFiles({
          config: { include: [] },
          extend: {
            tsconfig,
            resolved: { projectDirPath: path.dirname(projectPath), projectFilePath: projectPath },
          },
        });

  const exclude =
    argv.exclude != null
      ? toArray(argv.exclude)
      : getTsExcludeFiles({
          config: { exclude: [] },
          extend: {
            tsconfig,
            resolved: { projectDirPath: path.dirname(projectPath), projectFilePath: projectPath },
          },
        });

  const mode = argv.mode ?? CE_CTIX_BUILD_MODE.BUNDLE_MODE;

  // Pass the resolved absolute projectPath so that downstream functions
  // (ProjectContainer, getExtendOptions, etc.) do not re-resolve the relative
  // path against process.cwd() instead of getCwd().
  const resolvedArgv = { ...argv, project: projectPath };

  if (mode === CE_CTIX_BUILD_MODE.CREATE_MODE) {
    options.options = [
      await transformCreateMode(resolvedArgv, {
        ...resolvedArgv,
        mode: CE_CTIX_BUILD_MODE.CREATE_MODE,
        include,
        exclude,
      }),
    ];

    return options;
  }

  const output = getOutputValue(resolvedArgv, { output: argv.output });

  if (mode === CE_CTIX_BUILD_MODE.MODULE_MODE) {
    options.options = [
      await transformModuleMode(resolvedArgv, {
        ...resolvedArgv,
        mode: CE_CTIX_BUILD_MODE.MODULE_MODE,
        include,
        exclude,
      }),
    ];

    return options;
  }

  options.options = [
    transformBundleMode(resolvedArgv, {
      ...resolvedArgv,
      mode: CE_CTIX_BUILD_MODE.BUNDLE_MODE,
      output,
      include,
      exclude,
    }),
  ];

  return options;
}
