import { getConfigValue } from '#/configs/getConfigValue';
import { getConfigFilePath } from '#/modules/path/getConfigFilePath';
import { describe, expect, it, jest } from '@jest/globals';
import findUp from 'find-up';
import * as mnf from 'my-node-fp';

// ---------------------------------------------------------------------------------------------
// getConfigValue
// ---------------------------------------------------------------------------------------------
describe('getConfigValue', () => {
  it('character c, string type', () => {
    const configPath = 'i-am-c';
    const input = { $0: '', c: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toEqual(configPath);
  });

  it("character c, don't string type", () => {
    const configPath = {};
    const input = { $0: '', c: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toBeUndefined();
  });

  it('character config, string type', () => {
    const configPath = 'i-am-config';
    const input = { $0: '', config: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toEqual(configPath);
  });

  it("character config, don't string type", () => {
    const configPath = {};
    const input = { $0: '', config: configPath };
    const data = getConfigValue(input, 'c', 'config');

    expect(data).toBeUndefined();
  });

  it('empty keys', () => {
    const configPath = {};
    const input = { $0: '', config: configPath };
    const data = getConfigValue(input);

    expect(data).toBeUndefined();
  });
});

describe('getConfigFilePath', () => {
  it('config path from argv', () => {
    const spyH = jest.spyOn(mnf, 'existsSync').mockImplementationOnce(() => true);

    const configPath = 'i-am-config';
    const input = { $0: '', config: configPath };
    const c = getConfigFilePath(input);

    spyH.mockRestore();

    expect(c).toEqual(configPath);
  });

  it('config path from process.cwd() with find-up', () => {
    const findUpPath = 'i-am-findUp';
    const spyH01 = jest
      .spyOn(mnf, 'existsSync')
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    const spyH02 = jest.spyOn(findUp, 'sync').mockImplementationOnce(() => findUpPath);

    const configPath = 'i-am-config';
    const input = { $0: '', config: configPath };
    const c = getConfigFilePath(input);

    spyH01.mockRestore();
    spyH02.mockRestore();

    expect(c).toEqual(findUpPath);
  });

  it('config path from project-path with find-up', () => {
    const findUpPath = 'i-am-findUp';
    const spyH01 = jest
      .spyOn(mnf, 'existsSync')
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    const spyH02 = jest
      .spyOn(findUp, 'sync')
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => findUpPath);

    const configPath = 'i-am-config';
    const projectPath = 'i-am-project';
    const input = { $0: '', config: configPath };

    const c = getConfigFilePath(input, projectPath);

    spyH01.mockRestore();
    spyH02.mockRestore();

    expect(c).toEqual(findUpPath);
  });

  it('undefined - not founded, empty project path', () => {
    const spyH01 = jest
      .spyOn(mnf, 'existsSync')
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    const spyH02 = jest
      .spyOn(findUp, 'sync')
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => undefined);

    const configPath = 'i-am-config';
    const input = { $0: '', config: configPath };

    const c = getConfigFilePath(input);

    spyH01.mockRestore();
    spyH02.mockRestore();

    expect(c).toBeUndefined();
  });

  it('undefined - not founded, pass project path', () => {
    const spyH01 = jest
      .spyOn(mnf, 'existsSync')
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    const spyH02 = jest
      .spyOn(findUp, 'sync')
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => undefined);

    const configPath = 'i-am-config';
    const projectPath = 'i-am-project';
    const input = { $0: '', config: configPath };

    const c = getConfigFilePath(input, projectPath);

    spyH01.mockRestore();
    spyH02.mockRestore();

    expect(c).toBeUndefined();
  });
});
