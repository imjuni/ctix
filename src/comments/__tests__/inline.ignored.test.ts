import { getInlineIgnoredFiles } from '#/comments/getInlineIgnoredFiles';
import { describe, expect, it } from '@jest/globals';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import * as tsm from 'ts-morph';

const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('getInlineIgnoredFiles', () => {
  it('multiline comment with file, statement ignore', () => {
    const uuid = randomUUID();
    const filename01 = `${uuid}_01.ts`;
    const source01 = `
/**
 * @ctix-ignore
 */
import path from 'node:path';

/**
 * @ctix-ignore-next
 */
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const filename02 = `${uuid}_02.ts`;
    const source02 = `
import path from 'node:path';

export class SuperHero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    context.project.createSourceFile(filename01, source01.trim());
    context.project.createSourceFile(filename02, source02.trim());

    const ignored = getInlineIgnoredFiles({
      project: context.project,
      extendOptions: { eol: '\n' },
      filePaths: [filename01, filename02],
    });

    expect(ignored).toMatchObject([
      {
        commentCode: '* @ctix-ignore',
        pos: 2,
        line: 1,
        finded: true,
        namespaces: undefined,
        filePath: path.join(process.cwd(), filename01),
      },
    ]);
  });

  it('multiline comment with file, statement ignore', () => {
    const uuid = randomUUID();
    const filename01 = `${uuid}_01.ts`;
    const source01 = `
import path from 'node:path';

/** I am plain comment */
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const filename02 = `${uuid}_02.ts`;
    const source02 = `
import path from 'node:path';

/** @ctix-ignore-next */
export class MarvelHero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class DCHero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    context.project.createSourceFile(filename01, source01.trim());
    context.project.createSourceFile(filename02, source02.trim());

    const ignored = getInlineIgnoredFiles({
      project: context.project,
      extendOptions: { eol: '\n' },
      filePaths: [filename01, filename02],
    });

    console.log(ignored);

    // expect(ignored).toMatchObject([
    //   {
    //     commentCode: '* @ctix-ignore',
    //     pos: 2,
    //     line: 1,
    //     finded: true,
    //     namespaces: undefined,
    //     filePath: path.join(process.cwd(), filename01),
    //   },
    // ]);
  });
});
