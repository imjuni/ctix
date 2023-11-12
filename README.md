# ctix - Next generation Create TypeScript Index file

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues)
[![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix)
[![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE)
[![ci](https://github.com/imjuni/ctix/actions/workflows/ci.yml/badge.svg)](https://github.com/imjuni/ctix/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/ctix/branch/master/graph/badge.svg?token=DADV7ss5bh)](https://codecov.io/gh/imjuni/ctix)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

entrypoint `index.ts` file automatically generated cli tool

## Why ctix?

Have you ever developed a library project in the TypeScript language? Unlike API servers or desktop applications, library projects do not have executable scripts or functions. Therefore, it is common to organize a number of functions and variables to be included in the library in an `index.ts` file. However, it is inconvenient to rewrite the `index.ts` file every time you add a function or variable, and it is easy to make a mistake and miss a function or variable you intended. `ctix` uses the [TypeScript compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) to automatically generate the `index.ts` file by searching your TypeScript project for functions and variables with the export keyword added.

To summarize,

1. automatically extracts statement with the export keyword applied
1. generate a single `index.ts` file or directory-specific `index.ts` files
1. automatically generate configuration files via interactive prompts
1. automatically add type keyword to interface, type aliases to indicate they are pure types
   - eg. `export { type IAmSuperHero } from './marvel';`
1. can be set to exception files via comments in source code files (eslint style)

In addition, `ctix` will auto-generate `index.ts` files so that a single `index.d.ts` file can be generated correctly when using the [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) plugin. Now you can develop your TypeScript library projects more easily!

## Table of Contents <!-- omit in toc -->

- [Why ctix?](#why-ctix)
- [Getting Starts](#getting-starts)
- [How it works?](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
  - [How can I exclude unwanted files?](#how-can-i-exclude-unwanted-files)
- [Requirement](#requirement)
- [Important](#important)
- [More information](#more-information)
- [What is difference Re-Map paths?](#what-is-difference-re-map-paths)
- [Option](#option)
- [License](#license)
- [References](#references)

## Getting Starts

```bash
npm install ctix --save-dev
npx ctix init
npx ctix build
```

`ctix` provides interactive prompts to help you create the configuration file. Execute the `ctix init` command to create a configuration file.

## How it works?

The graph below outlines the behavioral flow of `ctix`.

```mermaid
flowchart TD
    START(start) --> |execute cli|ctix
    ctix --> |TypeScript Compiler API| INP01[Source Code files]
    ctix --> |TypeScript Compiler API| INP02["tsconfig.json"]
    ctix --> |json, json5, yaml| INP03[".ctirc"]
    INP01 --> TF[/Summray target source files/]
    INP02 --> TF
    INP03 --> TF
    TF --> TS[/Summray target export statements/]
    TS --> IW["index.ts file generation"]
    IW --> END(end)
```

Because `ctix` uses the TypeScript Compiler API to summary target files and extract export statements, developers don't need to write source code in a special format or make any changes to existing code to make it work.

## Installation

```bash
npm install ctix --save-dev
```

## Usage

```bash
# bundle mode
ctix build --mode bundle -p ./tsconfig.json -o ./src

# create mode
ctix build --mode create -p ./tsconfig.json --start-from ./src

# module mode
ctix build --mode module -p ./tsconfig.json -o ./src/components
```

The mode in which the `index.ts` file is to be generated. There is a create mode that generates an `index.ts` file per directory, a bundle mode that generates a single `index.ts` file, and a module mode that generates an `index.ts` file by filename for `vue`, `sevelte`, etc.

| `bundle` mode                              | `create` mode                              | `module` mode                              |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| ![bundle mode](static/img/bundle-mode.png) | ![create mode](static/img/create-mode.png) | ![module mode](static/img/module-mode.png) |

Check out the `.ctirc` in [example/type10](https://github.com/imjuni/ctix/blob/master/example/type10/.ctirc) to see how to utilize the `module` mode.

### How can I exclude unwanted files?

There are two ways to do this. The first is to create a `.ctirc` file and set the include or exclude value, which works similarly to the include and exclude values in the `tsconfig.json` file. The second is to comment out `@ctix-exclude` at the top of the files you want to exclude, such as eslint.

> `.ctirc`

```json
{
  "options": {
    "mode": "bundle",
    "exclude": [
      "**/*.storybook.tsx"
    ]
  }
}
```

If you want to use a `.ctirc` file, I recommend creating one with the `npx ctix init` command.

> eslint style inline comment

```tsx
// @ctix-exclude

const Button = () => {
  return <button>Sample</button>
}
```

## Requirement

- Node.js 18
- TypeScript

## Important

`ctix` does not work in JavaScript code because it uses TypeScript API, please use it **`before`** Babel translation or TypeScript compilation.

## More information

- [Applying a font file to your source code](https://github.com/imjuni/ctix/blob/master/doc/IN_DEPTH_FONT.md)
- [Applying a Vue.js components to your source code](https://github.com/imjuni/ctix/blob/master/doc/IN_DEPTH_VUE.md)
- [Applying a include, exclude configuration to `.ctirc`](https://github.com/imjuni/ctix/blob/master/doc/IN_DEPTH_EXCLUDE.md)

## What is difference Re-Map paths?

It is not recommended to use `index.ts` file to re-map paths or shorten the paths. If you want to shorten the paths use [Re-Map paths](https://www.typescriptlang.org/tsconfig#paths) feature in TypeScript compilerOptions. `ctix` is recommended for webpack and rollup.js, typedoc entrypoint and TypeScript declaration file bundling.

## Option

- build command
  - [bundle mode](https://github.com/imjuni/ctix/blob/master/doc/OPTION_BUILD_BUNDLE.md)
  - [create mode](https://github.com/imjuni/ctix/blob/master/doc/OPTION_BUILD_CREATE.md)
  - [module mode](https://github.com/imjuni/ctix/blob/master/doc/OPTION_BUILD_MODULE.md)
- [remove command](https://github.com/imjuni/ctix/blob/master/doc/OPTION_REVMOE.md)

## License

This software is licensed under the [MIT](https://github.com/imjuni/ctix/blob/master/LICENSE).

## References

- [AST browser](https://ts-ast-viewer.com/)
- [Tree generator](https://tree.nathanfriend.io/)
