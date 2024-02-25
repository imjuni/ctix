import { getInlineExcludedFiles } from '#/comments/getInlineExcludedFiles';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('getInlineExcludedFiles', () => {
  it('comment top of file', () => {
    const uuid = randomUUID();
    const filename01 = `${uuid}_01.ts`;
    const source01 = `
/**
 * @ctix-exclude
 */
import path from 'node:path';

/**
 * @ctix-exclude-next
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

    const excluded = getInlineExcludedFiles({
      project: context.project,
      extendOptions: { eol: '\n' },
      filePaths: [filename01, filename02],
    });

    expect(excluded).toMatchObject([
      {
        commentCode: '/**\n * @ctix-exclude\n */',
        filePath: posixJoin(process.cwd(), filename01),
        pos: {
          start: 25,
          line: 4,
          column: 1,
        },
        tag: 'ctix-exclude',
        workspaces: [],
      },
    ]);
  });

  it('comment middle of file', () => {
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

export class MarvelHero {
  #name: string;
  
  constructor(name: string) {
    this.#name = name;
  }
}

// @ctix-exclude
export class DCHero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    context.project.createSourceFile(filename01, source01.trim());
    context.project.createSourceFile(filename02, source02.trim());

    const excluded = getInlineExcludedFiles({
      project: context.project,
      extendOptions: { eol: '\n' },
      filePaths: [filename01, filename02],
    });

    expect(excluded).toMatchObject([
      {
        commentCode: '// @ctix-exclude',
        filePath: posixJoin(process.cwd(), filename02),
        pos: {
          start: 154,
          line: 12,
          column: 1,
        },
        tag: 'ctix-exclude',
        workspaces: [],
      },
    ]);
  });
});
