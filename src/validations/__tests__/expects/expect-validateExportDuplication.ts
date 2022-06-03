import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import chalk from 'chalk';
import { replaceSepToPosix } from 'my-node-fp';

export default {
  valid: false,
  filePaths: [
    posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
    posixJoin(env.exampleType03Path, 'index.d.ts'),
    posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
  ],
  duplicate: {
    indexWriter: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/createTypeScriptIndex.d.ts',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter' },
          { identifier: 'createTypeScriptIndex' },
          { identifier: 'ICreateTsIndexOption' },
        ],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/index.d.ts',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter' },
          { identifier: 'createTypeScriptIndex' },
          { identifier: 'ICreateTsIndexOption' },
        ],
      },
    ],
    createTypeScriptIndex: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/createTypeScriptIndex.d.ts',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter' },
          { identifier: 'createTypeScriptIndex' },
          { identifier: 'ICreateTsIndexOption' },
        ],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/index.d.ts',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter' },
          { identifier: 'createTypeScriptIndex' },
          { identifier: 'ICreateTsIndexOption' },
        ],
      },
    ],
    ICreateTsIndexOption: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/createTypeScriptIndex.d.ts',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter' },
          { identifier: 'createTypeScriptIndex' },
          { identifier: 'ICreateTsIndexOption' },
        ],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/index.d.ts',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [
          { identifier: 'indexWriter' },
          { identifier: 'createTypeScriptIndex' },
          { identifier: 'ICreateTsIndexOption' },
        ],
      },
    ],
    bomb: [
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'lawyer',
          'appliance',
          'bomb.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance'),
        relativeFilePath: posixJoin('type03', 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
        depth: 4,
        starExported: true,
        defaultExport: { identifier: 'bomb' },
        namedExports: [{ identifier: 'bomb' }],
      },
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'lawyer',
          'appliance',
          'bomb.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance'),
        relativeFilePath: posixJoin('type03', 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
        depth: 4,
        starExported: true,
        defaultExport: { identifier: 'bomb' },
        namedExports: [{ identifier: 'bomb' }],
      },
    ],
  },
  reasons: [
    {
      type: 'error',
      lineAndCharacter: {
        line: 14,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
      message: `detect same name of export statement: "${chalk.yellow('indexWriter')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 14,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `detect same name of export statement: "${chalk.yellow('indexWriter')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 19,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
      message: `detect same name of export statement: "${chalk.yellow('createTypeScriptIndex')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 19,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `detect same name of export statement: "${chalk.yellow('createTypeScriptIndex')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'createTypeScriptIndex.d.ts'),
      message: `detect same name of export statement: "${chalk.yellow('ICreateTsIndexOption')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 1,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `detect same name of export statement: "${chalk.yellow('ICreateTsIndexOption')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 16,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
      message: `detect same name of default export statement: "${chalk.yellow('bomb')}"`,
    },
    {
      type: 'error',
      lineAndCharacter: {
        line: 3,
        character: 16,
      },
      nodes: [null],
      filePath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
      message: `detect same name of default export statement: "${chalk.yellow('bomb')}"`,
    },
  ],
};
