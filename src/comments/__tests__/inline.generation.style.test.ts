import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineStyle } from '#/comments/getInlineStyle';
import { getSourceFileComments } from '#/comments/getSourceFileComments';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import * as cp from 'comment-parser';
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

const tsconfigPath = posixJoin(process.cwd(), 'examples', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

const s01 = `
/**
* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur odio nulla. Curabitur vel varius arcu. 
* Pellentesque consectetur nulla fermentum, tristique mauris nec, sollicitudin lectus. In quam nisi, tempor ac ex ut, 
* accumsan commodo massa. Donec posuere nisi ligula, eu fermentum massa pharetra et. Nullam cursus, ante nec fermentum 
* ullamcorper, neque urna rutrum magna, id venenatis nunc erat vitae lectus. Aenean quis laoreet lectus. 
* Morbi at viverra urna.
* 
* @ctix-generation-style default-alias-named-star namespace-001 namespace-002
*/

// test -01
// test -02
/// test -03
import path from 'node:path';

/*
* @ctix-exclude-next
*/
export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}`;

const s02 = `
/* test - 01 */
import path from 'node:path';

/*
* @ctix-exclude-next
*/
export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}`;

const s03 = `
/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur odio nulla. 
 * 
 * @ctix-generation-style default-alias-named-star
 * @params string description
 */

// test -01
// test -02
/// test -03
import path from 'node:path';

/*
* @ctix-exclude-next
*/
export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}`;

describe('getInlineStyle', () => {
  it('found style comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;

    const sourceFile = context.project.createSourceFile(filename, s01.trim());
    const sourceFileComments = getSourceFileComments(sourceFile);

    const results = sourceFileComments.comments
      .map((comment) =>
        getInlineStyle({
          comment,
          options: { keyword: CE_INLINE_COMMENT_KEYWORD.FILE_GENERATION_STYLE_KEYWORD },
        }),
      )
      .filter((c) => c != null);

    expect(results).toMatchObject([
      {
        commentCode:
          '/**\n* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur odio nulla. Curabitur vel varius arcu. \n* Pellentesque consectetur nulla fermentum, tristique mauris nec, sollicitudin lectus. In quam nisi, tempor ac ex ut, \n* accumsan commodo massa. Donec posuere nisi ligula, eu fermentum massa pharetra et. Nullam cursus, ante nec fermentum \n* ullamcorper, neque urna rutrum magna, id venenatis nunc erat vitae lectus. Aenean quis laoreet lectus. \n* Morbi at viverra urna.\n* \n* @ctix-generation-style default-alias-named-star namespace-001 namespace-002\n*/',
        filePath: posixJoin(process.cwd(), filename),
        style: 'default-alias-named-star',
        pos: {
          line: 14,
          column: 1,
        },
        workspaces: ['namespace-001', 'namespace-002'],
      },
    ]);
  });

  it('not found style comment', () => {
    const spyH01 = vitest.spyOn(cp, 'parse').mockImplementation(() => []);

    const uuid = randomUUID();
    const filename = `${uuid}.ts`;

    const sourceFile = context.project.createSourceFile(filename, s02.trim());
    const sourceFileComments = getSourceFileComments(sourceFile);

    const results = sourceFileComments.comments
      .map((comment) =>
        getInlineStyle({
          comment,
          options: { keyword: CE_INLINE_COMMENT_KEYWORD.FILE_GENERATION_STYLE_KEYWORD },
        }),
      )
      .filter((c) => c != null);

    spyH01.mockRestore();

    expect(results).toEqual([]);
  });

  it('no namespace', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;

    const mockValue = [
      {
        description:
          '/** Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur odio nulla.',
        tags: [
          {
            tag: 'ctix-generation-style',
            name: 'default-alias-named-star',
            type: '',
            optional: false,
            description: undefined,
            problems: [],
            source: [
              {
                number: 3,
                source: ' * @ctix-generation-style default-alias-named-star',
                tokens: {
                  start: ' ',
                  delimiter: '*',
                  postDelimiter: ' ',
                  tag: '@ctix-generation-style',
                  postTag: ' ',
                  name: 'default-alias-named-star',
                  postName: '',
                  type: '',
                  postType: '',
                  description: '',
                  end: '',
                  lineEnd: '',
                },
              },
            ],
          },
          {
            tag: 'params',
            name: 'string',
            type: '',
            optional: false,
            description: 'description */',
            problems: [],
            source: [
              {
                number: 4,
                source: ' * @params string description',
                tokens: {
                  start: ' ',
                  delimiter: '*',
                  postDelimiter: ' ',
                  tag: '@params',
                  postTag: ' ',
                  name: 'string',
                  postName: ' ',
                  type: '',
                  postType: '',
                  description: 'description',
                  end: '',
                  lineEnd: '',
                },
              },
              {
                number: 5,
                source: ' */ */',
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
                  description: '*/ ',
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
            source: '/** /**',
            tokens: {
              start: '',
              delimiter: '/**',
              postDelimiter: ' ',
              tag: '',
              postTag: '',
              name: '',
              postName: '',
              type: '',
              postType: '',
              description: '/**',
              end: '',
              lineEnd: '',
            },
          },
          {
            number: 1,
            source:
              ' * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur odio nulla. ',
            tokens: {
              start: ' ',
              delimiter: '*',
              postDelimiter: ' ',
              tag: '',
              postTag: '',
              name: '',
              postName: '',
              type: '',
              postType: '',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur odio nulla. ',
              end: '',
              lineEnd: '',
            },
          },
          {
            number: 2,
            source: ' * ',
            tokens: {
              start: ' ',
              delimiter: '*',
              postDelimiter: ' ',
              tag: '',
              postTag: '',
              name: '',
              postName: '',
              type: '',
              postType: '',
              description: '',
              end: '',
              lineEnd: '',
            },
          },
          {
            number: 3,
            source: ' * @ctix-generation-style default-alias-named-star',
            tokens: {
              start: ' ',
              delimiter: '*',
              postDelimiter: ' ',
              tag: '@ctix-generation-style',
              postTag: ' ',
              name: 'default-alias-named-star',
              postName: '',
              type: '',
              postType: '',
              description: '',
              end: '',
              lineEnd: '',
            },
          },
          {
            number: 4,
            source: ' * @params string description',
            tokens: {
              start: ' ',
              delimiter: '*',
              postDelimiter: ' ',
              tag: '@params',
              postTag: ' ',
              name: 'string',
              postName: ' ',
              type: '',
              postType: '',
              description: 'description',
              end: '',
              lineEnd: '',
            },
          },
          {
            number: 5,
            source: ' */ */',
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
              description: '*/ ',
              end: '*/',
              lineEnd: '',
            },
          },
        ],
        problems: [],
      },
    ];

    const spyH01 = vitest.spyOn(cp, 'parse').mockImplementationOnce(() => mockValue as any);
    const sourceFile = context.project.createSourceFile(filename, s03.trim());
    const sourceFileComments = getSourceFileComments(sourceFile);

    const results = sourceFileComments.comments
      .map((comment) =>
        getInlineStyle({
          comment,
          options: { keyword: CE_INLINE_COMMENT_KEYWORD.FILE_GENERATION_STYLE_KEYWORD },
        }),
      )
      .filter((c) => c != null);

    spyH01.mockRestore();

    expect(results).toMatchObject([
      {
        commentCode:
          '/**\n * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur odio nulla. \n * \n * @ctix-generation-style default-alias-named-star\n * @params string description\n */',
        filePath: posixJoin(process.cwd(), filename),
        style: 'default-alias-named-star',
        pos: {
          line: 11,
          column: 1,
        },
        workspaces: [],
      },
    ]);
  });
});
