import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getCommentKind } from '#/comments/getCommentKind';
import { getInlineExclude } from '#/comments/getInlineExclude';
import { getSourceFileComments } from '#/comments/getSourceFileComments';
import type { IStatementComments } from '#/comments/interfaces/IStatementComments';
import { posixJoin } from '#/modules/path/posixJoin';
import * as cp from 'comment-parser';
import copy from 'fast-copy';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it, vitest } from 'vitest';

vitest.mock('comment-parser', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('comment-parser')>();
  return {
    ...mod,
  };
});

const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('getCommentKind', () => {
  it('pass', () => {
    const r01 = getCommentKind(tsm.SyntaxKind.MultiLineCommentTrivia);
    const r02 = getCommentKind(tsm.SyntaxKind.SingleLineCommentTrivia);
    const r03 = getCommentKind(tsm.SyntaxKind.NewLineTrivia);

    expect(r01).toEqual(tsm.SyntaxKind.MultiLineCommentTrivia);
    expect(r02).toEqual(tsm.SyntaxKind.SingleLineCommentTrivia);
    expect(r03).toEqual(tsm.SyntaxKind.SingleLineCommentTrivia);
  });
});

describe('getSourceFileComments', () => {
  it('inline comment by multiple line document comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
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

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceFileComments(sourceFile);

    expect(comments).toMatchObject({
      filePath: posixJoin(process.cwd(), filename),
      comments: [
        { kind: tsm.SyntaxKind.MultiLineCommentTrivia, pos: { column: 1, line: 4, start: 25 } },
        { kind: tsm.SyntaxKind.MultiLineCommentTrivia, pos: { column: 1, line: 9, start: 86 } },
      ],
    });
  });

  it('inline comment by multiple line comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/*
 * @ctix-exclude
 */
import path from 'node:path';

/*
 * @ctix-exclude-next
 */
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceFileComments(sourceFile);

    expect(comments).toMatchObject({
      filePath: posixJoin(process.cwd(), filename),
      comments: [
        { kind: tsm.SyntaxKind.MultiLineCommentTrivia, pos: { column: 1, line: 4, start: 24 } },
        { kind: tsm.SyntaxKind.MultiLineCommentTrivia, pos: { column: 1, line: 9, start: 84 } },
      ],
    });
  });

  it('inline comment by single line document comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
// @ctix-exclude
import path from 'node:path';

// @ctix-exclude-next
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceFileComments(sourceFile);

    expect(comments).toMatchObject({
      filePath: posixJoin(process.cwd(), filename),
      comments: [
        { kind: tsm.SyntaxKind.SingleLineCommentTrivia, pos: { column: 1, line: 2, start: 17 } },
        { kind: tsm.SyntaxKind.SingleLineCommentTrivia, pos: { column: 1, line: 5, start: 70 } },
      ],
    });
  });

  it('inline comment by multiple line triple slash comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/// @ctix-exclude
import path from 'node:path';

/// @ctix-exclude-next
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceFileComments(sourceFile);

    expect(comments).toMatchObject({
      filePath: posixJoin(process.cwd(), filename),
      comments: [
        { kind: tsm.SyntaxKind.SingleLineCommentTrivia, pos: { column: 1, line: 2, start: 18 } },
        { kind: tsm.SyntaxKind.SingleLineCommentTrivia, pos: { column: 1, line: 5, start: 72 } },
      ],
    });
  });
});

describe('getInlineExclude', () => {
  it('document comment string, no namespace', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 1,
        column: 1,
        start: 1,
      },
      filePath: posixJoin(process.cwd(), filename),
      range: '/**\n * @ctix-exclude\n */',
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toMatchObject({
      commentCode: '/**\n * @ctix-exclude\n */',
      filePath: posixJoin(process.cwd(), filename),
      tag: 'ctix-exclude',
      pos: {
        line: 1,
        column: 1,
        start: 1,
      },
      workspaces: [],
    });
  });

  it('multiline comment string, no namespace', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 2,
        column: 2,
        start: 2,
      },
      filePath: posixJoin(process.cwd(), filename),
      range: '/*\n\n * @ctix-exclude\n */',
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toMatchObject({
      commentCode: '/*\n\n * @ctix-exclude\n */',
      filePath: posixJoin(process.cwd(), filename),
      tag: 'ctix-exclude',
      pos: {
        line: 2,
        column: 2,
        start: 2,
      },
      workspaces: [],
    });
  });

  it('multiline document comment string, no namespace, last line', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const range = [
      `/**\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
      `\n *\n * @ctix-exclude\n */`,
    ].join('');
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 3,
        column: 3,
        start: 3,
      },
      filePath: posixJoin(process.cwd(), filename),
      range,
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toMatchObject({
      commentCode: range,
      tag: 'ctix-exclude',
      pos: {
        line: 3,
        column: 3,
        start: 3,
      },
      filePath: posixJoin(process.cwd(), filename),
      workspaces: [],
    });
  });

  it('multiline document comment string, no namespace, first line', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const range = [
      `/**\n * @ctix-exclude\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
      `\n */`,
    ].join('');
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 4,
        column: 4,
        start: 4,
      },
      filePath: posixJoin(process.cwd(), filename),
      range,
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toMatchObject({
      commentCode: range,
      tag: 'ctix-exclude',
      pos: {
        line: 4,
        column: 4,
        start: 4,
      },
      filePath: posixJoin(process.cwd(), filename),
      workspaces: [],
    });
  });

  it('multiline document comment string, single namespace, first line', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const range = [
      `/**\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
      `\n *\n * @ctix-exclude i-am-ironman\n */`,
    ].join('');
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 5,
        column: 5,
        start: 5,
      },
      filePath: posixJoin(process.cwd(), filename),
      range,
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toMatchObject({
      commentCode: range,
      tag: 'ctix-exclude',
      pos: {
        line: 5,
        column: 5,
        start: 5,
      },
      filePath: posixJoin(process.cwd(), filename),
      workspaces: ['i-am-ironman'],
    });
  });

  it('multiline document comment string, multiple namespace, first line', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const range = [
      `/**\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
      `\n *\n * @ctix-exclude i-am-ironman, i-am-marvel\n */`,
    ].join('');
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 6,
        column: 6,
        start: 6,
      },
      filePath: posixJoin(process.cwd(), filename),
      range,
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toMatchObject({
      commentCode: range,
      tag: 'ctix-exclude',
      pos: {
        line: 6,
        column: 6,
        start: 6,
      },
      filePath: posixJoin(process.cwd(), filename),
      workspaces: ['i-am-ironman', 'i-am-marvel'],
    });
  });

  it('multiline statement comment string, no namespace', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const range = '/** @ctix-exclude-next */';
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 7,
        column: 7,
        start: 7,
      },
      filePath: posixJoin(process.cwd(), filename),
      range,
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toMatchObject({
      commentCode: range,
      tag: 'ctix-exclude-next',
      pos: {
        line: 7,
        column: 7,
        start: 7,
      },
      filePath: posixJoin(process.cwd(), filename),
      workspaces: [],
    });
  });

  it('multiline statement comment string, no namespace', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 8,
        column: 8,
        start: 8,
      },
      filePath: posixJoin(process.cwd(), filename),
      range: '/** not comment */',
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD,
      },
    });

    expect(r01).toBeUndefined();
  });

  it('empty comment block', () => {
    const spyH01 = vitest.spyOn(cp, 'parse').mockImplementation(() => []);

    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 8,
        column: 8,
        start: 8,
      },
      filePath: posixJoin(process.cwd(), filename),
      range: '/** not comment */',
    };

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD,
      },
    });

    spyH01.mockRestore();

    expect(r01).toBeUndefined();
  });

  it('undefined name, description', () => {
    const mockValue = {
      description: '',
      tags: [
        {
          tag: 'ctix-exclude-next',
          name: 'i-am-ironman,',
          type: '',
          optional: false,
          description: 'i-am-marvel',
          problems: [],
          source: [
            {
              number: 10,
              source: ' * @ctix-exclude-next i-am-ironman, i-am-marvel',
              tokens: {
                start: ' ',
                delimiter: '*',
                postDelimiter: ' ',
                tag: '@ctix-exclude-next',
                postTag: ' ',
                name: 'i-am-ironman,',
                postName: ' ',
                type: '',
                postType: '',
                description: 'i-am-marvel',
                end: '',
                lineEnd: '',
              },
            },
            {
              number: 11,
              source: ' */',
              tokens: {
                start: ' ',
                delimiter: '',
                postDelimiter: '',
                tag: '',
                postTag: '',
                name: '',
                postName: '',
                type: '',
                postType: '',
                description: '',
                end: '*/',
                lineEnd: '',
              },
            },
          ],
        },
      ],
      source: [
        {
          number: 0,
          source: ' * @ctix-exclude-next i-am-ironman, i-am-marvel',
          tokens: {
            start: ' ',
            delimiter: '*',
            postDelimiter: ' ',
            tag: '@ctix-exclude-next',
            postTag: ' ',
            name: 'i-am-ironman,',
            postName: ' ',
            type: '',
            postType: '',
            description: 'i-am-marvel',
            end: '',
            lineEnd: '',
          },
        },
      ],
      problems: [],
    };

    const v1 = copy(mockValue);
    v1.tags[0].description = undefined as any;
    v1.tags[0].name = undefined as any;

    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const range = '/** @ctix-exclude-next */';
    const comment: IStatementComments = {
      kind: tsm.SyntaxKind.MultiLineCommentTrivia,
      pos: {
        line: 7,
        column: 7,
        start: 7,
      },
      filePath: posixJoin(process.cwd(), filename),
      range,
    };

    const spyH01 = vitest.spyOn(cp, 'parse').mockImplementation(() => [v1]);

    const r01 = getInlineExclude({
      comment,
      options: {
        keyword: CE_INLINE_COMMENT_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD,
      },
    });

    spyH01.mockRestore();

    expect(r01).toMatchObject({
      commentCode: '/** @ctix-exclude-next */',
      filePath: posixJoin(process.cwd(), filename),
      pos: {
        line: 7,
        column: 7,
        start: 7,
      },
      tag: 'ctix-exclude-next',
      workspaces: [],
    });
  });
});
