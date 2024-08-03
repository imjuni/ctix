import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getConfigFilePath } from '#/configs/modules/getConfigFilePath';
import { readConfigFromFile } from '#/configs/modules/readConfigFromFile';
import { readConfigFromPackageJson } from '#/configs/modules/readConfigFromPackageJson';
import { readConfigFromTsconfigJson } from '#/configs/modules/readConfigFromTsconfigJson';
import fs from 'fs';
import pathe from 'pathe';
import { assert, describe, expect, it, vitest } from 'vitest';

/*
 * caution
 *
 * `process.cwd()` function have to return absolute path.
 * if you return relative path, find-up exectue infinity loop
 */
describe('readConfigFilePath', () => {
  it('user pass configuration arguments', async () => {
    const expectFilePath = 'a';
    const configFilePath = await getConfigFilePath(
      CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME,
      expectFilePath,
    );
    expect(configFilePath).toEqual(expectFilePath);
  });

  it('find-up configuration file', async () => {
    const expectFilePath = pathe.join(process.cwd(), 'examples', 'type10');
    const spyH01 = vitest.spyOn(process, 'cwd').mockImplementation(() => expectFilePath);
    const configFilePath = await getConfigFilePath(CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME);

    spyH01.mockRestore();

    expect(configFilePath).toEqual(
      pathe.join(expectFilePath, CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME),
    );
  });

  it('find-up cannot found configuration file', async () => {
    const expectFilePath = pathe.join(process.cwd(), 'examples', 'type01');
    const spyH01 = vitest.spyOn(process, 'cwd').mockImplementation(() => expectFilePath);
    const configFilePath = await getConfigFilePath(CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME);

    spyH01.mockRestore();

    expect(configFilePath).toBeUndefined();
  });
});

describe('readConfigFile', () => {
  it('successfully read configuration file on passed file-path', async () => {
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() =>
        Promise.resolve(Buffer.from('// i am comment on configuration file\n{"name":"hello"}')),
      );

    const config = await readConfigFromFile('config-file-path');

    spyH01.mockRestore();

    assert(config.type === 'pass');
    expect(config.pass).toMatchObject({ name: 'hello' });
  });

  it('successfully read configuration file on passed file-path but invalid yaml format', async () => {
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() =>
        Promise.resolve(Buffer.from('// test\n\n   - name:hello} // aa\n- name:hello')),
      );

    const config = await readConfigFromFile('config-file-path');

    spyH01.mockRestore();

    assert(config.type === 'fail');
    expect(config.fail).toBeInstanceOf(Error);
  });

  it('fail read configuration file on passed file-path, invalid yaml format', async () => {
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() =>
        Promise.resolve(Buffer.from('   - name:hello} // aa\n- name:hello')),
      );

    const config = await readConfigFromFile('config-file-path');

    spyH01.mockRestore();

    assert(config.type === 'fail');
    expect(config.fail).toBeInstanceOf(Error);
  });
});

describe('readConfigFromPackageJson', () => {
  it('successfully read configuration on package.json', async () => {
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() =>
        Promise.resolve(
          Buffer.from(JSON.stringify({ name: 'ctix', ctix: { include: ['src/**/*.ts'] } })),
        ),
      );

    const config = await readConfigFromPackageJson();
    spyH01.mockRestore();

    assert(config.type === 'pass');
    expect(config.pass).toMatchObject({ include: ['src/**/*.ts'] });
  });

  it('fail read configuration on package.json', async () => {
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() => Promise.resolve(Buffer.from(JSON.stringify({ name: 'ctix' }))));

    const config = await readConfigFromPackageJson();
    spyH01.mockRestore();

    assert(config.type === 'fail');
    expect(config.fail).instanceOf(Error);
  });

  it('fail read configuration on package.json', async () => {
    const spyH01 = vitest.spyOn(fs.promises, 'readFile').mockImplementation(() => {
      throw new Error('raise error by testcase');
    });

    const config = await readConfigFromPackageJson();
    spyH01.mockRestore();

    assert(config.type === 'fail');
    expect(config.fail).instanceOf(Error);
  });
});

describe('readConfigFromTsconfigJson', () => {
  it('successfully read configuration on tsconfig.json', async () => {
    const filePath = pathe.join(process.cwd(), 'tsconfig.json');
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() =>
        Promise.resolve(
          Buffer.from(JSON.stringify({ name: 'ctix', ctix: { include: ['src/**/*.ts'] } })),
        ),
      );

    const config = await readConfigFromTsconfigJson(filePath);
    spyH01.mockRestore();

    assert(config.type === 'pass');
    expect(config.pass).toMatchObject({ include: ['src/**/*.ts'] });
  });

  it('fail read configuration on tsconfig.json, because invalid json content', async () => {
    const filePath = pathe.join(process.cwd(), 'tsconfig.json');
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() => Promise.resolve(Buffer.from('{ invalid json contents')));

    const config = await readConfigFromTsconfigJson(filePath);
    spyH01.mockRestore();

    assert(config.type === 'fail');
    expect(config.fail).instanceOf(Error);
  });

  it('fail read configuration on tsconfig.json, because not found configuration in tsconfig.json', async () => {
    const filePath = pathe.join(process.cwd(), 'tsconfig.json');
    const spyH01 = vitest
      .spyOn(fs.promises, 'readFile')
      .mockImplementation(() => Promise.resolve(Buffer.from(JSON.stringify({ name: 'ctix' }))));

    const config = await readConfigFromTsconfigJson(filePath);
    spyH01.mockRestore();

    assert(config.type === 'fail');
    expect(config.fail).instanceOf(Error);
  });

  it('fail read configuration on tsconfig.json', async () => {
    const filePath = pathe.join(process.cwd(), 'tsconfig.json');
    const spyH01 = vitest.spyOn(fs.promises, 'readFile').mockImplementation(() => {
      throw new Error('raise error by testcase');
    });

    const config = await readConfigFromTsconfigJson(filePath);
    spyH01.mockRestore();

    assert(config.type === 'fail');
    expect(config.fail).instanceOf(Error);
  });
});
