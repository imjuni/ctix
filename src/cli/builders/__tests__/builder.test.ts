import { setCommandBundleOptions } from '#/cli/builders/setCommandBundleOptions';
import { setCommandCreateOptions } from '#/cli/builders/setCommandCreateOptions';
import { setCommandRemoveOptions } from '#/cli/builders/setCommandRemoveOptions';
import { setCommonGenerateOptions } from '#/cli/builders/setCommonGenerateOptions';
import { setProjectOptions } from '#/cli/builders/setProjectOptions';
import type { ICommandBundleOptions } from '#/configs/interfaces/ICommandBundleOptions';
import type { ICommandCreateOptions } from '#/configs/interfaces/ICommandCreateOptions';
import type { ICommandRemoveOptions } from '#/configs/interfaces/ICommandRemoveOptions';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import type { ICommonTsGenerateOptions } from '#/configs/interfaces/ICommonTsGenerateOptions';
import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import { describe, expect, it } from '@jest/globals';
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
      const builded = setCommonGenerateOptions(
        y as unknown as yargs.Argv<ICommonGenerateOptions & ICommonTsGenerateOptions>,
      );
      expect(builded).toBeDefined();
    });
  });

  describe('setCommandCreateOptions', () => {
    it('common option builded', () => {
      const y = yargs(hideBin(process.argv));
      const builded = setCommandCreateOptions(y as unknown as yargs.Argv<ICommandCreateOptions>);
      expect(builded).toBeDefined();
    });
  });

  describe('setCommandBundleOptions', () => {
    it('common option builded', () => {
      const y = yargs(hideBin(process.argv));
      const builded = setCommandBundleOptions(y as unknown as yargs.Argv<ICommandBundleOptions>);
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
