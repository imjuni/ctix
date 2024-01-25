import { setCommandRemoveOptions } from '#/cli/builders/setCommandRemoveOptions';
import { setModeBundleOptions } from '#/cli/builders/setModeBundleOptions';
import { setModeCreateOptions } from '#/cli/builders/setModeCreateOptions';
import { setModeGenerateOptions } from '#/cli/builders/setModeGenerateOptions';
import { setProjectOptions } from '#/cli/builders/setProjectOptions';
import type { ICommandRemoveOptions } from '#/configs/interfaces/ICommandRemoveOptions';
import type { IModeBundleOptions } from '#/configs/interfaces/IModeBundleOptions';
import type { IModeCreateOptions } from '#/configs/interfaces/IModeCreateOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import type { IModeTsGenerateOptions } from '#/configs/interfaces/IModeTsGenerateOptions';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import { describe, expect, it } from 'vitest';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

describe('option builder', () => {
  describe('setProjectOptions', () => {
    it('common option builded', () => {
      const y = yargs(hideBin(process.argv));
      const builded = setProjectOptions(y as unknown as yargs.Argv<IProjectOptions>);
      expect(builded).toBeDefined();
    });
  });

  describe('setCommonGenerateOptions', () => {
    it('common option builded', () => {
      const y = yargs(hideBin(process.argv));
      const builded = setModeGenerateOptions(
        y as unknown as yargs.Argv<IModeGenerateOptions & IModeTsGenerateOptions>,
      );
      expect(builded).toBeDefined();
    });
  });

  describe('setCommandCreateOptions', () => {
    it('common option builded', () => {
      const y = yargs(hideBin(process.argv));
      const builded = setModeCreateOptions(y as unknown as yargs.Argv<IModeCreateOptions>);
      expect(builded).toBeDefined();
    });
  });

  describe('setCommandBundleOptions', () => {
    it('common option builded', () => {
      const y = yargs(hideBin(process.argv));
      const builded = setModeBundleOptions(y as unknown as yargs.Argv<IModeBundleOptions>);
      expect(builded).toBeDefined();
    });
  });

  describe('setCommandRemoveOptions', () => {
    it('common option builded', () => {
      const y = yargs(hideBin(process.argv));
      const builded = setCommandRemoveOptions(y as unknown as yargs.Argv<ICommandRemoveOptions>);
      expect(builded).toBeDefined();
    });
  });
});
