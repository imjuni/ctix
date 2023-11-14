import { setCommandInitOptions } from '#/cli/builders/setCommandInitOptions';
import { setCommandRemoveOptions } from '#/cli/builders/setCommandRemoveOptions';
import { setModeBundleOptions } from '#/cli/builders/setModeBundleOptions';
import { setModeCreateOptions } from '#/cli/builders/setModeCreateOptions';
import { setModeGenerateOptions } from '#/cli/builders/setModeGenerateOptions';
import { setProjectOptions } from '#/cli/builders/setProjectOptions';
import { buildCommand } from '#/cli/commands/buildCommand';
import { initCommand } from '#/cli/commands/initCommand';
import { removeCommand } from '#/cli/commands/removeCommand';
import { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { ICommandInitOptions } from '#/configs/interfaces/ICommandInitOptions';
import type { ICommandRemoveOptions } from '#/configs/interfaces/ICommandRemoveOptions';
import type { IModeBundleOptions } from '#/configs/interfaces/IModeBundleOptions';
import type { IModeCreateOptions } from '#/configs/interfaces/IModeCreateOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import type { IModeTsGenerateOptions } from '#/configs/interfaces/IModeTsGenerateOptions';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import { loadConfig } from '#/configs/loadConfig';
import consola from 'consola';
import { isError } from 'my-easy-fp';
import sourceMapSupport from 'source-map-support';
import yargs, { type Argv, type CommandModule } from 'yargs';
import { hideBin } from 'yargs/helpers';

sourceMapSupport.install();

const buildCommandModule: CommandModule<TCommandBuildArgvOptions, TCommandBuildArgvOptions> = {
  command: CE_CTIX_COMMAND.BUILD_COMMAND,
  aliases: [CE_CTIX_COMMAND.BUILD_COMMAND_ALIAS],
  describe: 'build index.ts file that aggregate on bundle file',
  builder: (argv) => {
    const projectArgv = setProjectOptions<Argv<IModeGenerateOptions & IModeTsGenerateOptions>>(
      argv as Argv<IProjectOptions>,
    );

    const generateArgv = setModeGenerateOptions<Argv<IModeBundleOptions>>(projectArgv);
    const bundleArgv = setModeBundleOptions<Argv<IModeCreateOptions>>(generateArgv);
    const createArgv = setModeCreateOptions<Argv<TCommandBuildArgvOptions>>(bundleArgv);

    return createArgv;
  },
  handler: async (argv) => {
    try {
      await buildCommand(argv);
    } catch (catched) {
      const err = isError(catched, new Error('unknown error raised from bundle command'));
      consola.error(err);
    }
  },
};

const removeCommandModule: CommandModule<
  TCommandRemoveOptions & TCommandBuildArgvOptions,
  TCommandRemoveOptions & TCommandBuildArgvOptions
> = {
  command: CE_CTIX_COMMAND.REMOVE_COMMAND,
  aliases: [CE_CTIX_COMMAND.REMOVE_COMMAND_ALIAS],
  describe: 'remove index.ts file',
  builder: (argv) => {
    const commonArgv = setProjectOptions<Argv<ICommandRemoveOptions>>(
      argv as unknown as Argv<IProjectOptions>,
    );
    const removeArgv =
      setCommandRemoveOptions<Argv<TCommandRemoveOptions & TCommandBuildArgvOptions>>(commonArgv);

    return removeArgv;
  },
  handler: async (argv) => {
    try {
      await removeCommand(argv);
    } catch (catched) {
      const err = isError(catched, new Error('unknown error raised from remove command'));
      consola.error(err);
    }
  },
};

const initCommandModule: CommandModule<ICommandInitOptions, ICommandInitOptions> = {
  command: CE_CTIX_COMMAND.INIT_COMMAND,
  aliases: [CE_CTIX_COMMAND.INIT_COMMAND_ALIAS],
  describe: 'create .ctirc configuration',
  builder: (argv) => {
    const initArgv = setCommandInitOptions<Argv<ICommandInitOptions>>(
      argv as unknown as Argv<ICommandInitOptions>,
    );

    return initArgv;
  },
  handler: async (argv) => {
    try {
      await initCommand(argv);
    } catch (catched) {
      const err = isError(catched, new Error('unknown error raised from init command'));
      consola.error(err);
    }
  },
};

const handler = async () => {
  const parser = yargs(hideBin(process.argv));

  parser
    .command(buildCommandModule as CommandModule<object, TCommandBuildArgvOptions>)
    .command(removeCommandModule as CommandModule<object, TCommandRemoveOptions>)
    .command(initCommandModule as CommandModule<object, object>)
    .demandCommand()
    .recommendCommands()
    .config(await loadConfig())
    .help();

  await parser.argv;
};

handler().catch((caught) => {
  const err = isError(caught, new Error('unknown error raised'));
  consola.error(err);
  process.exit(1);
});
