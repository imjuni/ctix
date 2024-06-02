import { isDeclarationFile } from '#/compilers/isDeclarationFile';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { randomUUID } from 'node:crypto';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

const tsconfigPath = posixJoin(process.cwd(), 'examples', 'tsconfig.example.json');
const context = {
  tsconfig: tsconfigPath,
  project: new tsm.Project({
    tsConfigFilePath: tsconfigPath,
  }),
};

describe('isDeclarationFile', () => {
  it('file have only import-declarations', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
import 'date-fns';
import '@foly-poills';
import 'react';
import 'steam';
import '@babel/polyfill';
`;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const r01 = isDeclarationFile(sourceFile);
    expect(r01).toBeTruthy();
  });

  it('file have only module-declarations', () => {
    const uuid = randomUUID();
    const filename = `${uuid}.ts`;
    const source = `
declare module 'fatify' {
  interface FastifyInstance {
    auth: (req: FatifyRequest) => boolean;
  }
}

declare module 'fatify-request-context' {
  interface FastifyRequest {
    context: { 
      name: string;
      uuid: string;
    }
  }
}
`;

    const sourceFile = context.project.createSourceFile(filename, source.trim());
    const r01 = isDeclarationFile(sourceFile);
    expect(r01).toBeTruthy();
  });
});
