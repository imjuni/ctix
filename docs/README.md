# ctix - Next generation Create TypeScript Index file

[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues) [![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix) [![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE) [![ctix](https://circleci.com/gh/imjuni/ctix.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/ctix?branch=master)

## Installation

```bash
npm i ctix --save-dev
```

## Usage

```bash
ctix create -p ./tsconfig.json
```

## Introduction

You have to create a list of files when bundling with [webpack](https://webpack.js.org/) and [rollup.js](https://rollupjs.org/guide/en/), or creating documents with [typedoc](https://typedoc.org/). It's boring to re-list files every time they change files change. ctix is a simple tool that automates the creation of file lists.

## Why ctix?

An application project has a clear [entry point](https://webpack.js.org/concepts/entry-points/), but if it is a library project, the entry point is not clear, so you have to create it yourself. typedoc have to explicitly specify what to document, even for an application project.

1. use TypeScript compiler API
1. create index.ts file by separating default export and export
1. support isolatedModules option
1. various ignore options such as gitignore, npmignore, citignore

## Important

`ctix` does not work in JavaScript code because it uses TypeScript API, please use it **`before`** Babel translation or TypeScript compilation.

## How to works?

ctix use TypeScript Compiler API and directory structure. Export something from TypeScript source file after run ctix to create `index.ts` file.

### Create mode: As-Is tree structure

```text
├─ src/
│  ├─ component/
│  │  ├─ Nav.tsx
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  ├─ pages/
│  │  ├─ Hero.tsx
│  │  ├─ User.tsx
├─ App.tsx
```

### Create mode: To-Be tree structure

After `ctix create -p ./tsconfig.json` command.

```text
# To-Be
├─ src/
│  ├─ component/
│  │  ├─ Nav.tsx
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  │  ├─ index.ts   # created
│  ├─ pages/
│  │  ├─ Hero.tsx
│  │  ├─ User.tsx
│  │  ├─ index.ts   # created
│  ├─ index.ts      # created
├─ App.tsx
├─ index.ts         # created
```

Each file is as belows:

#### Create mode: `src/component/index.ts`

```ts
// created from 'ctix'
export * from './Nav';
export * from './Button';
export * from './Input';
```

#### Create mode: `src/pages/index.ts`

```ts
// created from 'ctix'
export * from './Hero';
export * from './User';
```

#### Create mode: `src/index.ts`

```ts
// created from 'ctix'
export * from './component';
export * from './pages';
```

#### Create mode: `index.ts`

```ts
// created from 'ctix'
export * from './App';
export * from './src';
```

### Single mode: As-Is tree structure

```text
├─ src/
│  ├─ component/
│  │  ├─ Nav.tsx
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  ├─ pages/
│  │  ├─ Hero.tsx
│  │  ├─ User.tsx
├─ App.tsx
```

### Single mode: To-Be tree structure

After `ctix single -p ./tsconfig.json` command. single mode create one `index.ts` file.

```text
├─ src/
│  ├─ component/
│  │  ├─ Nav.tsx
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  ├─ pages/
│  │  ├─ Hero.tsx
│  │  ├─ User.tsx
├─ App.tsx
├─ index.ts         # created
```

Each file is as belows:

#### Single mode: `index.ts`

```text
// created from 'ctix'
export * from './component/Nav';
export * from './component/Button';
export * from './component/Input';
export * from './pages/Hero';
export * from './pages/User';
export * from './App';
```

## Pros & Cons

### Pros

1. pass tsconfig.json file, another process don't care about
1. Support default exportation
   - using TypeScript API so detect default export and named export
   - my_default_index.test.ts file create `export { default as myDefaultIndexTest } from './my_default_index.test.ts'`
1. Partial ignore
   - specific export statement exclude on index.ts file.
   - eg. `{ "my_lib_package.ts": ["exists", "temp"] }`
1. Skip empty directory
1. isolatedModules support

### Cons

1. It may be slow for some project
   - since ctix uses TypeScript compiler API, big projects may take time to generate index files

## What is difference Re-Map paths?

It is not recommended to use `index.ts` file to re-map paths or shorten the paths. If you want to shorten the paths use [Re-Map paths](https://www.typescriptlang.org/tsconfig#paths) feature in TypeScript compilerOptions. `ctix` is recommended for webpack and rollup.js, typedoc entrypoint and TypeScript declaration file bundling.

## Option

| Name             | Short | Default     | Command                | Description                                                                                                                    |
| :--------------- | ----- | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| --config         | -c    |             | All                    | configuration file(.ctirc) path                                                                                                |
| --project        | -p    | required    | All                    | tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"                                              |
| --spinnerStream  |       | stdout      | All                    | Stream of cli spinner, you can pass stdout or stderr                                                                           |
| --progressStream |       | stdout      | All                    | Stream of cli progress, you can pass stdout or stderr                                                                          |
| --reasonerStream |       | stderr      | All                    | Stream of cli reasoner. Reasoner show name conflict error and already exist index.ts file error. You can pass stdout or stderr |
| --startAt        | -a    | = --project | All                    | start working from startAt directory. If you do not pass startAt use project directory.                                        |
| --exportFilename | -f    | index.ts    | create, single, remove | Export filename, if you not pass this field that use "index.ts" or "index.d.ts"                                                |
| --useSemicolon   | -s    | true        | create, single         | add semicolon on line ending at every export statement                                                                         |
| --useTimestamp   | -t    | false       | create, single         | timestamp write on ctix comment right-side, only works in useComment option set true                                           |
| --useComment     | -m    | true        | create, single         | ctix comment add on first line of created export file(default index.ts) file, that remark created from ctix                    |
| --quote          | -q    | '           | create, single         | change quote character at export syntax                                                                                        |
| --keepFileExt    | -k    | '           | create, single         | keep file extension on export statement path literal                                                                           |
| --overwrite      | -w    | '           | create, single         | overwrite each index.ts file                                                                                                   |
| --ignoreFile     | -g    |             | create, single         | ignore file name. You can pass ignore, config file at ctix and use it like profile                                             |
| --noBackup       |       | false       | create, single         | not create backup file even if set overwrite option enable                                                                     |
| --skipEmptyDir   | -e    | '           | create                 | empty directory skip create index.ts file                                                                                      |
| --output         | -o    | N/A         | single                 | output directory                                                                                                               |
| --useRootDir     | -r    | false       | single                 | output file under rootDir in tsconfig.json.                                                                                    |
| --includeBackup  | -b    | false       | remove                 | If this option set true on remove mode what will be delete backup file.                                                        |

## Ignore

Ignore file 3 way belows:

- `.gitignore`
- `.npmignore`
- `.ctiignore`

`.gitignore` file follow [.gitignore spec 2.22.1](http://git-scm.com/docs/gitignore). `.ctiignore` file key follow [.gitignore spec 2.22.1](http://git-scm.com/docs/gitignore). `.gitignore spec 2.22.` spec using by [ignore](https://github.com/kaelzhang/node-ignore) package. `.npmignore` spec using by [minimatch](https://github.com/isaacs/minimatch)

### .ctiignore

.ctiignore file is json with comments. See below.

```jsonc
{
  "juvenile/**": "*",
  "wellmade/FlakyCls.ts": "*",
  "wellmade/WhisperingCls.ts": "*",
  "wellmade/ChildlikeCls.ts": ["transfer", "stomach"]
}
```

json key indicate ignore file path. You can use glob pattern like `.gitignore`. If set `'*'` character at value that is totally ignore file or glob pattern. If set string array that is ignore type name array.

### ignore testcase

testcase directory ignore using glob pattern.

```jsonc
{
  // ignore testcase file
  "**/__tests__/*": "*"
}
```

The testcase file is ignored if you add to the ignore file or if there is no export syntax.

### rootDir, rootDirs

useRootDir option activate using rootDir option in tsconfig.json. This option run below [flowchart](https://github.com/imjuni/ctix/blob/master/docs/UseRootDir.md).

## CLI with .ctirc

ctix cli support `.ctirc` configuration file. Available name is only `.ctirc`. Also cti cli arguments forced applied. And `.ctirc` file can write [json with comments](https://www.npmjs.com/package/jsonc-parser).

## .ctirc creation

You can use cli for `.ctirc` file creation.

```bash
# create current directory
> cti init

# pass tsconfig.json path
> cti init -p ./server/tsconfig.json
```

## Breaking Change

0.6.x and 1.x version big different. See [migration guide](https://github.com/imjuni/ctix/blob/master/docs/MigrationGuide.md). cli command, option, ignore file changed. Support TypeScript `4.7.2` and `new file extensions(.mts, .cts, etc)`.

## Programming interface

Each command can use that function. Each function can pass isMessageDisplay flag second parameter. isMessageDisplay pass false or undefined after not display console message and progress.

| Function        | Argument                                   | command |
| :-------------- | :----------------------------------------- | :-----: |
| createWritor    | TCreateOptionWithDirInfo, isMessageDisplay | create  |
| singleWritor    | TSingleOptionWithDirInfo, isMessageDisplay | single  |
| removeIndexFile | TRemoveOptionWithDirInfo, isMessageDisplay | remove  |
| createInitFile  | TTInitOptionWithDirInfo, isMessageDisplay  |  init   |
