import { CE_INLINE_IGNORE_KEYWORD } from '#/comments/const-enum/CE_INLINE_IGNORE_KEYWORD';
import { getIgnoreNamespace } from '#/comments/getIgnoreNamespace';
import { getInlineIgnore } from '#/comments/getInlineIgnore';
import { getSourceCodeComment } from '#/comments/getSourceCodeComment';
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

describe('getSourceCodeComment', () => {
  it('inline comment by multiple line document comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
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

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceCodeComment(sourceFile);

    expect(comments.map((comment) => comment.getText())).toEqual([
      '/**\n * @ctix-ignore\n */',
      '/**\n * @ctix-ignore-next\n */',
    ]);
  });

  it('inline comment by multiple line comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/*
 * @ctix-ignore
 */
import path from 'node:path';

/*
 * @ctix-ignore-next
 */
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceCodeComment(sourceFile);

    expect(comments.map((comment) => comment.getText())).toEqual([
      '/*\n * @ctix-ignore\n */',
      '/*\n * @ctix-ignore-next\n */',
    ]);
  });

  it('inline comment by single line document comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
// @ctix-ignore
import path from 'node:path';

// @ctix-ignore-next
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceCodeComment(sourceFile);

    expect(comments.map((comment) => comment.getText())).toEqual([
      '// @ctix-ignore',
      '// @ctix-ignore-next',
    ]);
  });

  it('inline comment by multiple line triple slash comment', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
/// @ctix-ignore
import path from 'node:path';

/// @ctix-ignore-next
export default class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
    `;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const comments = getSourceCodeComment(sourceFile);

    expect(comments.map((comment) => comment.getText())).toEqual([
      '/// @ctix-ignore',
      '/// @ctix-ignore-next',
    ]);
  });
});

describe('getInlineIgnore', () => {
  it('document comment string, no namespace', () => {
    const comment = '/**\n * @ctix-ignore\n */';

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.FILE_IGNORE_KEYWORD,
    });

    expect(r01).toMatchObject({
      commentCode: '* @ctix-ignore',
      pos: 2,
      line: 1,
      finded: true,
      namespaces: undefined,
    });
  });

  it('multiline comment string, no namespace', () => {
    const comment = '/*\n\n * @ctix-ignore\n */';

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.FILE_IGNORE_KEYWORD,
    });

    expect(r01).toMatchObject({
      commentCode: '* @ctix-ignore',
      pos: 2,
      line: 2,
      finded: true,
      namespaces: undefined,
    });
  });

  it('multiline document comment string, no namespace, last line', () => {
    const comment = [
      `/**\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
      `\n *\n * @ctix-ignore\n */`,
    ].join('');

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.FILE_IGNORE_KEYWORD,
    });

    expect(r01).toMatchObject({
      commentCode: '* @ctix-ignore',
      pos: 2,
      line: 10,
      finded: true,
      namespaces: undefined,
    });
  });

  it('multiline document comment string, no namespace, first line', () => {
    const comment = [
      `/**\n * @ctix-ignore\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
    ].join('');

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.FILE_IGNORE_KEYWORD,
    });

    expect(r01).toMatchObject({
      commentCode: '* @ctix-ignore',
      pos: 2,
      line: 1,
      finded: true,
      namespaces: undefined,
    });
  });

  it('multiline document comment string, single namespace, first line', () => {
    const comment = [
      `/**\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
      `\n *\n * @ctix-ignore i-am-ironman\n */`,
    ].join('');

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.FILE_IGNORE_KEYWORD,
    });

    expect(r01).toMatchObject({
      commentCode: '* @ctix-ignore i-am-ironman',
      pos: 2,
      line: 10,
      finded: true,
      namespaces: ['i-am-ironman'],
    });
  });

  it('multiline document comment string, multiple namespace, first line', () => {
    const comment = [
      `/**\n * @class\n * @name BlendEffect\n * @classdesc Blends the input render target with another texture.\n * @description Creates new instance of the post effect.`,
      `\n * @augments PostEffect\n * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.`,
      `\n * @property {Texture} blendMap The texture with which to blend the input render target with.`,
      `\n * @property {number} mixRatio The amount of blending between the input and the blendMap. Ranges from 0 to 1.`,
      `\n *\n * @ctix-ignore i-am-ironman, i-am-marvel\n */`,
    ].join('');

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.FILE_IGNORE_KEYWORD,
    });

    expect(r01).toMatchObject({
      commentCode: '* @ctix-ignore i-am-ironman, i-am-marvel',
      pos: 2,
      line: 10,
      finded: true,
      namespaces: ['i-am-ironman', 'i-am-marvel'],
    });
  });

  it('multiline statement comment string, no namespace', () => {
    const comment = '/** @ctix-ignore-next */';

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.NEXT_STATEMENT_IGNORE_KEYWORD,
    });

    expect(r01).toMatchObject({
      commentCode: '/** @ctix-ignore-next */',
      pos: 4,
      line: 0,
      finded: true,
      namespaces: undefined,
    });
  });

  it('multiline statement comment string, no namespace', () => {
    const comment = '/** not comment */';

    const r01 = getInlineIgnore(comment, {
      eol: '\n',
      keyword: CE_INLINE_IGNORE_KEYWORD.NEXT_STATEMENT_IGNORE_KEYWORD,
    });

    expect(r01).toBeUndefined();
  });
});

describe('getIgnoreNamespace', () => {
  it('null value test', () => {
    const r01 = getIgnoreNamespace();
    expect(r01).toBeUndefined();
  });

  it('whitespace', () => {
    const r01 = getIgnoreNamespace('\t\t\t');
    const r02 = getIgnoreNamespace('   ');
    const r03 = getIgnoreNamespace('\n\n\n');
    const r04 = getIgnoreNamespace(' \t\n');

    expect(r01).toBeUndefined();
    expect(r02).toBeUndefined();
    expect(r03).toBeUndefined();
    expect(r04).toBeUndefined();
  });

  it('string value test', () => {
    const r01 = getIgnoreNamespace(' i-am-ironman');
    const r02 = getIgnoreNamespace(' i-am-ironman i-am-marvel');
    const r03 = getIgnoreNamespace(' i-am-ironman, i-am-marvel');
    const r04 = getIgnoreNamespace(' i-am-ironman, i-am-marvel, i-am-test01, i-am-test02');

    expect(r01).toEqual(['i-am-ironman']);
    expect(r02).toEqual(['i-am-ironman', 'i-am-marvel']);
    expect(r03).toEqual(['i-am-ironman', 'i-am-marvel']);
    expect(r04).toEqual(['i-am-ironman', 'i-am-marvel', 'i-am-test01', 'i-am-test02']);
  });

  it('remove star end', () => {
    const r01 = getIgnoreNamespace(' i-am-ironman *');
    const r02 = getIgnoreNamespace(' i-am-ironman */');
    const r03 = getIgnoreNamespace(' i-am-ironman **/');
    const r04 = getIgnoreNamespace(' i-am-ironman * **/');
    const r05 = getIgnoreNamespace(' i-am-ironman * */');

    expect(r01).toEqual(['i-am-ironman']);
    expect(r02).toEqual(['i-am-ironman']);
    expect(r03).toEqual(['i-am-ironman']);
    expect(r04).toEqual(['i-am-ironman']);
    expect(r05).toEqual(['i-am-ironman']);
  });
});
