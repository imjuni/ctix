import { getExportStatement } from '#/compilers/getExportStatement';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { describe, expect, it } from '@jest/globals';
import { randomUUID } from 'crypto';
import path from 'path';
import * as tsm from 'ts-morph';

const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('getExportStatements - Class', () => {
  it('greator than once, named export class', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class Ability {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statement = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename,
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 1,
          column: 1,
        },
        identifier: { name: 'Hero', alias: filenamify(filename) },
        isAnonymous: false,
        isPureType: false,
        isDefault: false,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
      {
        path: {
          filename,
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 9,
          column: 1,
        },
        identifier: { name: 'Ability', alias: filenamify(filename) },
        isAnonymous: false,
        isPureType: false,
        isDefault: false,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('greator than once, named export class', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    /*
     * 아래처럼 정의된 소스코드의 경우, default는 alias로 class 이름을 가진다. 그러나, import 구문을 생성할 때
     * star export를 한 경우가 아니라면 아래처럼 정의된 Hero 이름이 아닌, default로 이름이 대체된다. star export를
     * 한 경우에는 최종 번들링이 될 때 타입 번들러에 따라 동작이 상이한데, 일반적으로 Hero로 번들링이된다.
     *
     * 하지만 라이브러리 프로젝트인 경우 다시 한 번 강조하지만 default export를 하지 않는 것이 좋다. 아래처럼 이름이 default로
     * 만들어진 경우, name conflict이 발생하기 쉽기 때문이다. 아래는 이름이 있으니 상관이 없지만 이름이 없는 변수나 익명 함수는
     * default 이름을 그대로 가지고 가게 되기 때문에 name conflict가 발생하기 쉽다.
     */
    const source = `
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class Ability {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class Organization {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statement = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename,
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 1,
          column: 1,
        },
        identifier: { name: 'default', alias: 'Hero' },
        isAnonymous: false,
        isPureType: false,
        isIgnored: false,
        comments: [],
        isDefault: true,
      } satisfies IExportStatement,
      {
        path: {
          filename,
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 9,
          column: 1,
        },
        identifier: { name: 'Ability', alias: filenamify(filename) },
        isAnonymous: false,
        isPureType: false,
        isDefault: false,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
      {
        path: {
          filename,
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 17,
          column: 1,
        },
        identifier: { name: 'Organization', alias: filenamify(filename) },
        isAnonymous: false,
        isPureType: false,
        isDefault: false,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });

  it('call expression, named export class', async () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export default new Hero('ironman');
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());

    const statement = await getExportStatement(
      sourceFile,
      {
        project: context.tsconfig,
        exportFilename: 'index.ts',
      },
      { eol: '\n' },
    );

    expect(statement).toMatchObject([
      {
        path: {
          filename,
          dirPath: process.cwd(),
          relativePath: '..',
        },
        depth: 2,
        pos: {
          line: 9,
          column: 16,
        },
        identifier: {
          name: 'default',
          alias: filenamify(filename),
        },
        isAnonymous: true,
        isPureType: false,
        isDefault: true,
        isIgnored: false,
        comments: [],
      } satisfies IExportStatement,
    ]);
  });
});
