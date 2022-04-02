ctix - Next generation Create TypeScript Index file
----
[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues) [![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix) [![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE) [![ctix](https://circleci.com/gh/imjuni/ctix.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/ctix?branch=master)

# Installation
```bash
npm i ctix --save-dev

# or

npx ctix create ./tsconfig.json # execute create mode
```

# Breaking Change
0.4.x ctix generate default export variable, function, class process to lowercase start. But 0.5.x ctix can set excludePath. If set excludePath optoin to true, ctix follow filename first charactor.

ex>
```
Option excludePath set true and useUpperFirst true: TribeClass -> TribeClass 
Option excludePath set false or useUpperFirst false: TribeClass -> tribeClass
```

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
    * my_default_index.test.ts file create `export { default as myDefaultIndexTest } from './my_default_index.test'` 

## Cons
1. Something slow some project
    * ctix use TypeScript compiler API, big project some slow

# What is difference module resolution?
Most inconvenience from import statement that solve [module resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html). But module resolution don't helpful for entrypoint create for bundling. ctix helpful this work.

# Usage
## create
`ctix create ./tsconfig.json` or `ctix create -p ./tsconfig.json`
## single
`ctix single ./tsconfig.json` or `ctix single -p ./tsconfig.json`
## clean
`ctix clean ./tsconfig.json` or `ctix clean -p ./tsconfig.json`
## init
`ctix init ./tsconfig.json` or `ctix init -p ./tsconfig.json`

## Option
| Name | Short | Default | SubCommand | Description |
| -- | -- | -- | -- | -- |
| --project | -p | required | All | tsconfig.json path: you must pass path with filename, like this "./tsconfig.json" |
| --exportFilename | -f | index.ts | create, single, clean | Export filename, if you not pass this field that use "index.ts" or "index.d.ts" |
| --verbose | -v | false | All | Display more detailed log |
| --addNewline | -n | true | create, single | add newline on EOF |
| --useSemicolon | -s | true | create, single | add semicolon on line ending at every export statement |
| --useTimestamp | -m | false | create, single | timestamp write on ctix comment right-side, only works in useComment option set true |
| --useComment | -c | true | create, single | ctix comment add on first line of creted export file(default index.ts) file, that remark created from ctix |
| --quote | -q | ' | create, single | change quote character at export syntax |
| --output | -o | N/A | single | output directory |
| --useBackupFile | -b | true | create, single, clean | created backup file if exists export file(default index.ts) file already in directory. If this option set false on clean mode what will be delete backup file. |
| --useRootDir | -r | false | single | output file under rootDir in tsconfig.json. |
| --excludePath | -x | false | single | Default export name create without directory(dirname). |
| --useUpperFirst | N/A | true | create, single | If your default export variable, class, function name keep first capital character. |
| --includeBackup | N/A | false | clean | If this option set true on clean mode what will be delete backup file. |

## rootDir, rootDirs
useRootDir option activate using rootDir option in tsconfig.json. This option run below [flowchart](https://github.com/imjuni/ctix/blob/master/UseRootDir.md).

# CLI with .ctirc
ctix cli support `.ctirc` configuration file. Available name is only `.ctirc`. `.ctirc` configuration file can applied by each target directories and script working directory. Every configuration overwrited same feature. Also cti cli arguments forced applied. And `.ctirc` file can write [json5](https://json5.org) format. json5 spec. can comment and more feature.

## .ctirc creation
You can use cli for `.ctirc` file creation. 

```bash
# create current directory
> cti init

# create multiple directory
> cti init ./example/type03 ./example/type02
```

# Language
* [English](https://github.com/imjuni/ctix/blob/master/README.md)
* [Korean](https://github.com/imjuni/ctix/blob/master/README.ko.md)
