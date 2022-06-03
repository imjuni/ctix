ctix - Next generation Create TypeScript Index file
----
[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues) [![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix) [![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE) [![ctix](https://circleci.com/gh/imjuni/ctix.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/ctix?branch=master)

# Installation
```bash
npm i ctix --save-dev
```

# Usage
```
ctix create -p ./tsconfig.json
```

# Breaking Change
0.6.x and 1.x version big different. See [migration guide](https://github.com/imjuni/ctix/blob/master/docs/MigrationGuide.md). cli command, option, ignore file changed.

# Introduction
When you develop package for another application using TypeScript, that is compiled using by webpack, babel. webpack very popular tool for bundling. At this time you need bundle entrypoint called by index.ts. 

Manage index.ts(export file), not so convenience. If you add file or class, function you rewrite export file over and over again. `ctix` help this work. `ctix` read .npmignore, .ctiignore file after ignore there also you can use exclude configuration in tsconfig.json. See below example, 

```
  src/
    app.ts
    component/
      Nav.ts
      Button.ts
```

ctix create sub-command create index.ts file below.

```
  src/
    app.ts
    > index.ts
      // created from 'ctix'
      export * from './component';
      export * from './app';
    component/
      Nav.ts
      Button.ts
      > index.ts
        // created from 'ctix'
        export * from './Nav';
        export * from './Button';
```

ctix single mode generate single file. This file suitable for webpack entrypoint. 

```
  src/
    app.ts
    component/
      Nav.ts
      Button.ts
  > entrypoint.ts
    // created from 'ctix'
    export * from './src/app.ts'
    export * from './src/component/Nav.ts'
    export * from './src/component/Button.ts'
```

# Why ctix?
## Pros
1. pass tsconfig.json file, another process don't care about
1. Support default exportation
    * my_default_index.test.ts file create `export { default as myDefaultIndexTest } from './my_default_index.test.ts'`
1. Partial ignore
    * specific export statement exclude on index.ts file.
    * ex> { "my_lib_package.ts": ["exists", "temp"] }
1. Skip empty directory

## Cons
1. It may be slow for some project
    * since ctix uses TypeScript compiler API, big projects may take time to generate index files

# What is difference module resolution?
Most inconvenience from import statement that solve [module resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html). But module resolution don't helpful for entrypoint create for bundling. ctix helpful this work.

# Example
Example of each command.

```bash
# create
ctix create -p ./tsconfig.json
ctix c -p ./tsconfig.json

# single
ctix single -p ./tsconfig.json
ctix s -p ./tsconfig.json

# clean
ctix remove -p ./tsconfig.json
ctix r -p ./tsconfig.json

# init
ctix init
ctix i
```

## Option
| Name | Short | Default | Command | Description |
| :--: | -- | -- | -- | -- |
| --config | -c | | All | configuration file(.ctirc) path |
| --project | -p | required | All | tsconfig.json path: you must pass path with filename, like this "./tsconfig.json" |
| --exportFilename | -f | index.ts | create, single, clean | Export filename, if you not pass this field that use "index.ts" or "index.d.ts" |
| --useSemicolon | -s | true | create, single | add semicolon on line ending at every export statement |
| --useTimestamp | -t | false | create, single | timestamp write on ctix comment right-side, only works in useComment option set true |
| --useComment | -m | true | create, single | ctix comment add on first line of creted export file(default index.ts) file, that remark created from ctix |
| --quote | -q | ' | create, single | change quote character at export syntax |
| --keepFileExt | -k | ' | create, single | keep file extension on export statement path literal |
| --overwrite | -w | ' | create, single | overwrite each index.ts file |
| --skipEmptyDir | -e | ' | create | empty directory skip create index.ts file |
| --output | -o | N/A | single | output directory |
| --useRootDir | -r | false | single | output file under rootDir in tsconfig.json. |
| --includeBackup | N/A | false | clean | If this option set true on clean mode what will be delete backup file. |

# Ignore
Ignore file 3 way that is .gitignore, .npmignore, .ctiignore.

## .ctiignore
.ctiignore file is json with comments. See below.

```jsonc
{
  "juvenile/**": "*",
  "wellmade/FlakyCls.ts": "*",
  "wellmade/WhisperingCls.ts": "*",
  "wellmade/ChildlikeCls.ts": ["transfer","stomach"]
}
```
json key indicate file path. You can use glob pattern. If set `'*'` character at value that is totally ignore file or glob pattern. If set string array that is ignore type name array.


## rootDir, rootDirs
useRootDir option activate using rootDir option in tsconfig.json. This option run below [flowchart](https://github.com/imjuni/ctix/blob/master/UseRootDir.md).

# CLI with .ctirc
ctix cli support `.ctirc` configuration file. Available name is only `.ctirc`. `.ctirc` configuration file can applied by each target directories and script working directory. Every configuration overwrited same feature. Also cti cli arguments forced applied. And `.ctirc` file can write [json5](https://json5.org) format. json5 spec. can comment and more feature.

## .ctirc creation
You can use cli for `.ctirc` file creation. 

```bash
# create current directory
> cti init

# pass tsconfig.json path
> cti init -p ./server/tsconfig.json
```

# Programming interface
Each command can use that function. Each function can pass isMessageDisplay flag second parameter. isMessageDisplay pass false or undefined after not display console message and progress.

| Function | Argument |  command |
| :- | :- | :-: |
| createWritor | TCreateOptionWithDirInfo, isMessageDisplay | create |
| singleWritor | TSingleOptionWithDirInfo, isMessageDisplay | single |
| removeIndexFile | TRemoveOptionWithDirInfo, isMessageDisplay | remove |
| createInitFile | TTInitOptionWithDirInfo, isMessageDisplay | init |

# Language
* [English](https://github.com/imjuni/ctix/blob/master/README.md)
* [Korean](https://github.com/imjuni/ctix/blob/master/README.ko.md)
