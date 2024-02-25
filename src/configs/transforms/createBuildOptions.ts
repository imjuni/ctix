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
import { toArray } from 'my-easy-fp';
import path from 'node:path';
import type { ArgumentsCamelCase } from 'yargs';

export async function createBuildOptions(
  argv: ArgumentsCamelCase<TCommandBuildArgvOptions> & {
    options?: (TCreateOptions | TBundleOptions)[];
  },
): Promise<TCommandBuildOptions> {
  const options: TCommandBuildOptions = {
    $kind: CE_CTIX_COMMAND.BUILD_COMMAND,
    config: argv.config,
    spinnerStream: argv.spinnerStream,
    progressStream: argv.progressStream,
    reasonerStream: argv.reasonerStream,
    options: [],
  };

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
          const projectPath = path.resolve(option.project);
          const tsconfig = getTypeScriptConfig(projectPath);

          const moduleMode = await transformModuleMode(
            { ...argv, project: projectPath },
            {
              ...option,
              include: getTsIncludeFiles({
                config: { include: option.include },
                extend: { tsconfig, resolved: { projectDirPath: projectPath } },
              }),
              exclude: getTsExcludeFiles({
                config: { exclude: option.exclude },
                extend: { tsconfig },
              }),
            },
          );

          return moduleMode;
        }

        if (option.mode === CE_CTIX_BUILD_MODE.CREATE_MODE) {
          const projectPath = path.resolve(option.project);
          const tsconfig = getTypeScriptConfig(projectPath);

          const createMode = await transformCreateMode(
            { ...argv, project: projectPath },
            {
              ...option,
              include: getTsIncludeFiles({
                config: { include: option.include },
                extend: { tsconfig, resolved: { projectDirPath: projectPath } },
              }),
              exclude: getTsExcludeFiles({
                config: { exclude: option.exclude },
                extend: { tsconfig },
              }),
            },
          );

          return createMode;
        }

        const projectPath = path.resolve(option.project);
        const tsconfig = getTypeScriptConfig(projectPath);

        const bundleMode = transformBundleMode(
          { ...argv, project: projectPath },
          {
            ...option,
            include: getTsIncludeFiles({
              config: { include: option.include },
              extend: { tsconfig, resolved: { projectDirPath: projectPath } },
            }),
            exclude: getTsExcludeFiles({
              config: { exclude: option.exclude },
              extend: { tsconfig },
            }),
          },
        );
        return bundleMode;
      }),
    );

    return options;
  }

  const projectPath = path.resolve(argv.project);
  const tsconfig = getTypeScriptConfig(projectPath);

  const include =
    argv.include != null
      ? toArray(argv.include)
      : getTsIncludeFiles({
          config: { include: [] },
          extend: { tsconfig, resolved: { projectDirPath: projectPath } },
        });

  const exclude =
    argv.exclude != null
      ? toArray(argv.exclude)
      : getTsExcludeFiles({
          config: { exclude: [] },
          extend: { tsconfig },
        });

  const mode = argv.mode ?? CE_CTIX_BUILD_MODE.BUNDLE_MODE;

  if (mode === CE_CTIX_BUILD_MODE.CREATE_MODE) {
    options.options = [
      await transformCreateMode(argv, {
        ...argv,
        mode: CE_CTIX_BUILD_MODE.CREATE_MODE,
        include,
        exclude,
      }),
    ];

    return options;
  }

  const output = getOutputValue(argv, { output: argv.output });

  if (mode === CE_CTIX_BUILD_MODE.MODULE_MODE) {
    options.options = [
      await transformModuleMode(argv, {
        ...argv,
        mode: CE_CTIX_BUILD_MODE.MODULE_MODE,
        include,
        exclude,
      }),
    ];

    return options;
  }

  options.options = [
    transformBundleMode(argv, {
      ...argv,
      mode: CE_CTIX_BUILD_MODE.BUNDLE_MODE,
      output,
      include,
      exclude,
    }),
  ];

  return options;
}
