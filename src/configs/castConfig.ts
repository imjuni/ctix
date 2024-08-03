import { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';

export function castConfig(
  command: CE_CTIX_COMMAND,
  config: unknown,
  paths: {
    from: 'none' | '.ctirc' | 'tsconfig.json' | 'package.json';
    config?: string;
    tsconfig?: string;
  },
): TCommandBuildArgvOptions | TCommandRemoveOptions | IProjectOptions {
  switch (command) {
    case CE_CTIX_COMMAND.BUILD_COMMAND:
      return {
        ...(config as TCommandBuildArgvOptions),
        from: paths.from,
        p: paths.tsconfig,
        project: paths.tsconfig,
        c: paths.config,
        config: paths.config,
      } as TCommandBuildArgvOptions;

    case CE_CTIX_COMMAND.REMOVE_COMMAND:
      return {
        ...(config as TCommandRemoveOptions),
        from: paths.from,
        p: paths.tsconfig,
        project: paths.tsconfig,
        c: paths.config,
        config: paths.config,
      } as TCommandRemoveOptions;

    default:
      return {
        from: paths.from,
        p: paths.tsconfig,
        project: paths.tsconfig,
        c: paths.config,
        config: paths.config,
        exportFilename: 'index.ts',
        'export-filename': 'index.ts',
        spinnerStream: 'stderr',
        'spinner-stream': 'stderr',
        progressStream: 'stderr',
        'progress-stream': 'stderr',
        reasonerStream: 'stderr',
        'reasoner-stream': 'stderr',
      } as IProjectOptions;
  }
}
