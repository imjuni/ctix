# ctix - Next generation Create TypeScript barrel

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues)
[![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix)
[![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE)
[![ci](https://github.com/imjuni/ctix/actions/workflows/ci.yml/badge.svg)](https://github.com/imjuni/ctix/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/ctix/branch/master/graph/badge.svg?token=DADV7ss5bh)](https://codecov.io/gh/imjuni/ctix)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

entrypoint `barrel` file automatically generated cli tool

## Why ctix?

Have you ever developed a library project in the TypeScript language? Unlike API servers or desktop applications, library projects do not have executable scripts or functions. Therefore, it is common to organize a number of functions and variables to be included in the library in an `barrel` file. However, it is inconvenient to rewrite the `barrel` file every time you add a function or variable, and it is easy to make a mistake and miss a function or variable you intended. `ctix` uses the [TypeScript compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) to automatically generate the `barrel` file by searching your TypeScript project for functions and variables with the export keyword added.

To summarize,

1. automatically extracts statement with the export keyword applied
1. generate a single `barrel` file or directory-specific `barrel` files
1. automatically generate configuration files via interactive prompts
1. automatically add type keyword to interface, type aliases to indicate they are pure types
   - eg. `export { type IAmSuperHero } from './marvel';`
1. can be set to exception files via comments in source code files (eslint style)
1. always generates a compilable `barrel` file because it uses the TypeScript compiler API

In addition, `ctix` will auto-generate `barrel` files so that a single `index.d.ts` file can be generated correctly when using the [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) plugin. Now you can develop your TypeScript library projects more easily!

## Table of Contents <!-- omit in toc -->

- [Why ctix?](#why-ctix)
- [Getting Starts](#getting-starts)
- [How it works?](#how-it-works)
  - [Barrel file](#barrel-file)
- [Installation](#installation)
- [Usage](#usage)
  - [How can I exclude unwanted files?](#how-can-i-exclude-unwanted-files)
  - [Programming interface](#programming-interface)
- [Requirement](#requirement)
- [Important](#important)
- [Generation Style](#generation-style)
- [More information](#more-information)
- [Examples](#examples)
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
flowchart LR
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

### Barrel file

A [barrel](https://basarat.gitbook.io/typescript/main-1/barrel) is a way to rollup exports from several modules into a single convenient module. The barrel itself is a module file that re-exports selected exports of other modules.

- [TypeScript Deep Dive - barrel](https://basarat.gitbook.io/typescript/main-1/barrel)
- [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [In-Depth guide for TypeScript Library](https://dev.to/imjuni/in-depth-guide-for-typescript-library-project-o1j)

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

The mode in which the `barrel` file is to be generated. There is a create mode that generates an `barrel` file per directory, a bundle mode that generates a single `barrel` file, and a module mode that generates an `barrel` file by filename for `vue`, `sevelte`, etc.

| `bundle` mode                              | `create` mode                              | `module` mode                              |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| ![bundle mode](static/img/bundle-mode.png) | ![create mode](static/img/create-mode.png) | ![module mode](static/img/module-mode.png) |

Check out the `.ctirc` in [examples/type10](https://github.com/imjuni/ctix/blob/master/examples/type10/.ctirc) to see how to utilize the `module` mode.

### How can I exclude unwanted files?

There are two ways to do this. The first is to create a `.ctirc` file and set the include or exclude value, which works similarly to the include and exclude values in the `tsconfig.json` file. The second is to comment out `@ctix-exclude` at the top of the files you want to exclude, such as eslint.

> `.ctirc`

```json
{
  "options": {
    "mode": "bundle",
    "exclude": ["**/*.storybook.tsx"]
  }
}
```

If you want to use a `.ctirc` file, I recommend creating one with the `npx ctix init` command.

> eslint style inline comment

```tsx
// @ctix-exclude

const Button = () => {
  return <button>Sample</button>;
};
```

### Programming interface

When using task runners like Gulp and Just, as well as bundlers like webpack and rollup, you need a programming interface to add ctix.

| function     | option                                                                                                                                           | descryption                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| building     | [TCommandBuildOptions](src/configs/interfaces/TCommandBuildOptions.ts)                                                                           | Execute the `build` command  |
| initializing | [TCommandInitOptions](src/configs/interfaces/TCommandInitOptions.ts)                                                                             | Execute the `init` command   |
| removing     | [TCommandRemoveOptions](src/configs/interfaces/TCommandRemoveOptions.ts), [TCommandBuildOptions](src/configs/interfaces/TCommandBuildOptions.ts) | Execute the `remove` command |

Check out the [example code](doc/PROGRAMMING_INTERFACE.md).

## Requirement

- Node.js 18
- TypeScript

## Important

`ctix` does not work in JavaScript code because it uses TypeScript API, please use it **`before`** Babel translation or TypeScript compilation.

## Generation Style

The handling of the `default export` is an important issue, but many bundlers and type bundlers handle the `default export` differently, so ctix provides many ways to create a `default export`.

You can change the `generation style` of the entire project by setting the `generation-style` option, or you can change the `generation style` of only certain files by adding the `@ctix-generation-style` inline comment at the top of the file.

- [More about Generation Style](doc/IN_DEPTH_GEN_STYLE.md)

## More information

- [Applying a font file to your source code](doc/IN_DEPTH_FONT.md)
- [Applying a Vue.js components to your source code](doc/IN_DEPTH_VUE.md)
- [Applying a include, exclude configuration to `.ctirc`](doc/IN_DEPTH_EXCLUDE.md)

## Examples

In the examples directory, you can find cases where `ctix` has been applied to various projects. For detailed explanations, please refer to the [Examples README.md](examples/README.md) file.

| Directory Name | Purpose                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| type03         | When there are duplicate names in the entire project                           |
| type05         | For React projects                                                             |
| type06         | When using TypeScript enums                                                    |
| type07         | When using destructive operations on variables for named exports               |
| type09         | When using TTF fonts by declaring them as modules and using them in TypeScript |
| type10         | For Vue.js projects                                                            |
| type11         | When using Component Props in React projects                                   |

## What is difference Re-Map paths?

It is not recommended to use `index.ts` file to re-map paths or shorten the paths. If you want to shorten the paths use [Re-Map paths](https://www.typescriptlang.org/tsconfig#paths) feature in TypeScript compilerOptions. `ctix` is recommended for webpack and rollup.js, typedoc entrypoint and TypeScript declaration file bundling.

## Option

- build command
  - [bundle mode](doc/OPTION_BUILD_BUNDLE.md)
  - [create mode](doc/OPTION_BUILD_CREATE.md)
  - [module mode](doc/OPTION_BUILD_MODULE.md)
- [remove command](doc/OPTION_REVMOE.md)

## License

This software is licensed under the [MIT](LICENSE).

## References

- [AST browser](https://ts-ast-viewer.com/)
- [Tree generator](https://tree.nathanfriend.io/)
