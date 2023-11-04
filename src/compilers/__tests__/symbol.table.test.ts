import { SymbolTable } from '#/compilers/SymbolTable';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { beforeAll, describe, expect, it } from '@jest/globals';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const context: { uuid: string; filename: string; statement: IExportStatement }[] = [];

describe('SymbolTable', () => {
  beforeAll(() => {
    const fid01 = randomUUID();
    const fn01 = `${fid01}.ts`;

    const stmt01: IExportStatement = {
      path: {
        filename: fn01,
        dirPath: process.cwd(),
        relativePath: '.',
      },
      depth: 1,
      pos: {
        line: 1,
        column: 1,
      },
      isDefault: false,
      identifier: {
        name: fid01,
        alias: fid01,
      },
      isPureType: false,
      isAnonymous: false,
      isExcluded: false,
      comments: [],
    };

    const fid02 = randomUUID();
    const fn02 = `${fid02}.ts`;
    const stmt02: IExportStatement = {
      ...stmt01,
      path: {
        filename: fn02,
        dirPath: process.cwd(),
        relativePath: '.',
      },
      pos: {
        line: 2,
        column: 2,
      },
      identifier: {
        name: fid02,
        alias: fid02,
      },
    };

    const fid03 = randomUUID();
    const fn03 = `${fid03}.ts`;
    const stmt03: IExportStatement = {
      ...stmt01,
      path: {
        filename: fn03,
        dirPath: process.cwd(),
        relativePath: '.',
      },
      pos: {
        line: 3,
        column: 3,
      },
      identifier: {
        name: fid03,
        alias: fid03,
      },
    };

    const stmt04: IExportStatement = {
      ...stmt01,
      path: {
        filename: stmt01.path.filename,
        dirPath: path.join(process.cwd(), 'marvel'),
        relativePath: '.',
      },
      pos: {
        line: 4,
        column: 4,
      },
      identifier: {
        ...stmt01.identifier,
      },
    };

    const stmt05: IExportStatement = {
      ...stmt01,
      path: {
        filename: stmt01.path.filename,
        dirPath: path.join(process.cwd(), 'dc'),
        relativePath: '.',
      },
      pos: {
        line: 5,
        column: 5,
      },
      identifier: {
        ...stmt01.identifier,
      },
    };

    const fid06 = randomUUID();
    const fn06 = `${fid03}.ts`;
    const stmt06: IExportStatement = {
      ...stmt01,
      isDefault: true,
      path: {
        filename: fn06,
        dirPath: path.join(process.cwd(), 'dc'),
        relativePath: '.',
      },
      pos: {
        line: 6,
        column: 6,
      },
      identifier: {
        name: fid06,
        alias: fid06,
      },
    };

    const stmt07: IExportStatement = {
      ...stmt01,
      path: {
        filename: fn06,
        dirPath: path.join(process.cwd(), 'dc'),
        relativePath: '.',
      },
      pos: {
        line: 7,
        column: 7,
      },
      identifier: {
        name: fid06,
        alias: fid06,
      },
    };

    context.push({ uuid: fid01, filename: fn01, statement: stmt01 });
    context.push({ uuid: fid02, filename: fn02, statement: stmt02 });
    context.push({ uuid: fid03, filename: fn03, statement: stmt03 });
    context.push({ uuid: fid01, filename: fn01, statement: stmt04 });
    context.push({ uuid: fid01, filename: fn01, statement: stmt05 });
    context.push({ uuid: fid06, filename: fn06, statement: stmt06 });
    context.push({ uuid: fid06, filename: fn06, statement: stmt07 });
  });

  it('constructor', () => {
    const st = new SymbolTable();
    expect(st).toBeTruthy();
  });

  it('get key', () => {
    const statement: IExportStatement = {
      ...context[1].statement,
      identifier: { ...context[1].statement.identifier },
      isDefault: true,
    };
    statement.identifier.name = 'ironman01';
    statement.identifier.alias = 'ironman02';

    const r01 = SymbolTable.key('ironman');
    const r02 = SymbolTable.key(context[0].statement);
    const r03 = SymbolTable.key(statement);

    expect(r01).toEqual('ironman');
    expect(r02).toEqual(context[0].uuid);
    expect(r03).toEqual('ironman02');
  });

  it('insert and select', () => {
    const st = new SymbolTable();

    st.insert(context[0].statement);

    const r01 = st.select(context[0].statement);
    const r02 = st.select(SymbolTable.key(context[0].statement));
    const r03 = st.select('ironman');

    expect(r01).toMatchObject([context[0].statement] as any);
    expect(r02).toMatchObject([context[0].statement] as any);
    expect(r03).toMatchObject([]);
  });

  it('inserts', () => {
    const st = new SymbolTable();
    st.inserts([context[0].statement, context[1].statement, context[2].statement]);
    const r01 = st.select(context[0].statement);

    expect(r01).toMatchObject([context[0].statement] as any);
  });

  it('selects', () => {
    const st = new SymbolTable();
    st.inserts([context[0].statement, context[1].statement]);
    const r01 = st.selects();

    expect(r01).toMatchObject([[context[0].statement], [context[1].statement]] as any);
  });

  it('isDuplicate', () => {
    const st = new SymbolTable();

    st.insert(context[0].statement);
    st.insert(context[1].statement);
    st.insert(context[2].statement);
    st.insert(context[3].statement);

    const statement = {
      ...context[3].statement,
      identifier: { ...context[3].statement.identifier },
    };
    statement.identifier.name = 'ironman01';
    statement.identifier.alias = 'ironman02';

    expect(st.isDuplicate(context[3].statement)).toBeTruthy();
    expect(st.isDuplicate(statement)).toBeFalsy();
  });

  it('isDuplicateFromSecond', () => {
    const st = new SymbolTable();

    st.insert(context[0].statement);
    st.insert(context[1].statement);
    st.insert(context[2].statement);
    st.insert(context[3].statement);

    const statement = {
      ...context[3].statement,
      identifier: { ...context[3].statement.identifier },
    };
    statement.identifier.name = 'ironman01';
    statement.identifier.alias = 'ironman02';

    console.log(st.isDuplicateFromSecond(context[1].statement));
    console.log(st.isDuplicateFromSecond(context[3].statement));
    console.log(st.isDuplicateFromSecond(context[4].statement));
    console.log(st.isDuplicateFromSecond(statement));
  });

  it('getDuplicateReason', async () => {
    const st = new SymbolTable();
    st.inserts([
      context[0].statement,
      context[1].statement,
      context[2].statement,
      context[3].statement,
      context[4].statement,
      context[5].statement,
      context[6].statement,
    ]);
    const r01 = st.getDuplicateReason();

    expect(r01).toMatchObject([
      {
        type: 'warn',
        lineAndCharacter: {
          line: 1,
          character: 1,
        },
        filePath: path.join(context[0].statement.path.dirPath, context[0].statement.path.filename),
        message: `detect same name of export statement: "${chalk.yellow(context[0].uuid)}"`,
      },
      {
        type: 'warn',
        lineAndCharacter: {
          line: 4,
          character: 4,
        },
        filePath: path.join(context[3].statement.path.dirPath, context[3].statement.path.filename),
        message: `detect same name of export statement: "${chalk.yellow(context[3].uuid)}"`,
      },
      {
        type: 'warn',
        lineAndCharacter: {
          line: 5,
          character: 5,
        },
        filePath: path.join(context[4].statement.path.dirPath, context[4].statement.path.filename),
        message: `detect same name of export statement: "${chalk.yellow(context[4].uuid)}"`,
      },
      {
        type: 'warn',
        lineAndCharacter: {
          line: 6,
          character: 6,
        },
        filePath: path.join(context[5].statement.path.dirPath, context[5].statement.path.filename),
        message: `detect same name of default export statement: "${chalk.yellow(context[5].uuid)}"`,
      },
      {
        type: 'warn',
        lineAndCharacter: {
          line: 7,
          character: 7,
        },
        filePath: path.join(context[6].statement.path.dirPath, context[6].statement.path.filename),
        message: `detect same name of export statement: "${chalk.yellow(context[6].uuid)}"`,
      },
    ]);
  });
});
