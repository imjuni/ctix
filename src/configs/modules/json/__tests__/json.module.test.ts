import { getString } from '#/configs/modules/json/getString';
import { readJson5 } from '#/configs/modules/json/readJson5';
import { readJsonc } from '#/configs/modules/json/readJsonc';
import { readYaml } from '#/configs/modules/json/readYml';
import { parseConfig } from '#/configs/parseConfig';
import { stringify as stringify5 } from 'json5';
import { describe, expect, it } from 'vitest';
import { stringify as ystringify } from 'yaml';

describe('getString', () => {
  it('buffer', () => {
    const input = { name: 'ironman' };
    const data = JSON.stringify(input);
    const buf = Buffer.from(data);
    const str = getString(buf);

    expect(str).toEqual(data);
  });

  it('string', () => {
    const input = { name: 'ironman' };
    const data = JSON.stringify(input);
    const str = getString(data);

    expect(str).toEqual(data);
  });
});

// ---------------------------------------------------------------------------------------------
// json with comments
// ---------------------------------------------------------------------------------------------
describe('jsonc', () => {
  it('buffer type parsing', () => {
    const input = { name: 'ironman' };
    const data = JSON.stringify(input);
    const buf = Buffer.from(data);
    const json = readJsonc(buf);

    if (json.type === 'fail') {
      throw new Error('parsing fail');
    }

    expect(json.pass).toMatchObject(input);
  });

  it('string type parsing', () => {
    const input = { name: 'ironman' };
    const data = JSON.stringify(input);
    const json = readJsonc(data);

    if (json.type === 'fail') {
      throw new Error('parsing fail');
    }

    expect(json.pass).toMatchObject(input);
  });

  it('fail parsing', () => {
    const data = ` name: ironman `;
    const json = readJsonc(data);

    expect(json.type).toEqual('fail');
  });
});

// ---------------------------------------------------------------------------------------------
// json5
// ---------------------------------------------------------------------------------------------
describe('json5', () => {
  it('buffer type parsing', () => {
    const input = { name: 'ironman' };
    const data = stringify5(input);
    const buf = Buffer.from(data);
    const json = readJson5(buf);

    if (json.type === 'fail') {
      throw new Error('parsing fail');
    }

    expect(json.pass).toMatchObject(input);
  });

  it('string type parsing', () => {
    const input = { name: 'ironman' };
    const data = stringify5(input);
    const json = readJson5(data);

    if (json.type === 'fail') {
      throw new Error('parsing fail');
    }

    expect(json.pass).toMatchObject(input);
  });

  it('fail parsing', () => {
    const data = ` name: ironman `;
    const json = readJson5(data);

    expect(json.type).toEqual('fail');
  });
});

// ---------------------------------------------------------------------------------------------
// yaml
// ---------------------------------------------------------------------------------------------
describe('yaml', () => {
  it('buffer type parsing', () => {
    const input = { name: ['ironman', 'Tony'] };
    const data = ystringify(input);
    const buf = Buffer.from(data);
    const json = readYaml(buf);

    if (json.type === 'fail') {
      throw new Error('parsing fail');
    }

    expect(json.pass).toMatchObject(input);
  });

  it('string type parsing', () => {
    const input = { name: ['ironman', 'Tony'] };
    const data = ystringify(input);
    const json = readYaml(data);

    if (json.type === 'fail') {
      throw new Error('parsing fail');
    }

    expect(json.pass).toMatchObject(input);
  });

  it('fail parsing', () => {
    const data = `name: \n+ironman`;
    const json = readYaml(data);

    expect(json.type).toEqual('fail');
  });
});

// ---------------------------------------------------------------------------------------------
// json with comments
// ---------------------------------------------------------------------------------------------
describe('parseConfig', () => {
  it('buffer', () => {
    const input = { name: 'ironman' };
    const data = JSON.stringify(input);
    const buf = Buffer.from(data);

    const parsed = parseConfig(buf);
    expect(parsed).toMatchObject(input);
  });

  it('string', () => {
    const input = { name: 'ironman' };
    const data = JSON.stringify(input);

    const parsed = parseConfig(data);
    expect(parsed).toMatchObject(input);
  });

  it('json5', () => {
    const input = { name: 'ironman' };
    const data = stringify5(input);

    const parsed = parseConfig(data);
    expect(parsed).toMatchObject(input);
  });

  it('yaml', () => {
    const input = { name: 'ironman' };
    const data = ystringify(input);

    const parsed = parseConfig(data);
    expect(parsed).toMatchObject(input);
  });

  it('excpetion', () => {
    expect(() => {
      const data = `name: \n+ironman`;
      parseConfig(data);
    }).toThrowError();
  });
});
