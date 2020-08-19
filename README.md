ctix
----
[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues) [![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix) [![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/ctix.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/ctix?branch=master)

# Install
```bash
npm install ctix --save-dev
```

# Introduction
when you develop package for another application using TypeScript, that is compiled using by webpack, babel. webpack very popular tool for bundling. At this time you need bundle entrypoint called by index.ts. 

Manage export file, not so convenience. If you add file or class, function you rewrite export file over and over again. `ctix` help this work. `ctix` read .npmignore, .ctiignore file after ignore there also you can use exclude configuration in tsconfig.json. See below example, 


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

# Usage
## create mode
`ctix create ./tsconfig.json` or `ctix create -p ./tsconfig.json`
## single mode
`ctix single ./tsconfig.json` or `ctix single -p ./tsconfig.json`
## clean mode
`ctix clean ./tsconfig.json` or `ctix clean -p ./tsconfig.json`
## init mode
`ctix init ./tsconfig.json` or `ctix init -p ./tsconfig.json`

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
