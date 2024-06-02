# Examples

## Background

This directory contains examples of using ctix to generate `index.ts` files in various project types. The `examples` contains examples for various situations, including Vue.js, Font files declared as types, and more, to help illustrate how to approach using ctix, as well as writing test cases.

## Usage

`ctix` uses the TypeScript Compiler API using `ts-morph`, so it requires an `tsconfig.json` file as input. To help with testing, each example directory contains an `tsconfig.json` file, and when you add an example, you must create an `tsconfig.json` file to run the example.

You cannot run ctix with the npx tool because it is a directory within the ctix project, so you need to use npm scripts to run ctix. Run the command below.

```bash
# If you want to run the type12 example
USE_INIT_CWD=true pnpm run dev build -p examples/type12/tsconfig.json -o examples/type12
```

If you want to run an example other than type12, change type12 in the example above. USE_INIT_CWD is an environment variable that tells the script to use `INIT_CWD` instead of `process.cwd()` when it is run. The actual project does not need to use this environment variable. When you run the above command in your own project, you would enter,

```bash
npx ctix build -p [your tsconfig.json] -o [output directory]
```

## Example directories with a special purpose

| Directory Name | Purpose                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| type03         | When there are duplicate names in the entire project                           |
| type05         | For React projects                                                             |
| type06         | When using TypeScript enums                                                    |
| type07         | When using destructive operations on variables for named exports               |
| type09         | When using TTF fonts by declaring them as modules and using them in TypeScript |
| type10         | For Vue.js projects                                                            |
| type11         | When using Component Props in React projects                                   |

In light of the fact that export statements are collected in a single `index.ts` file, duplicate names cannot be used. In this case, aliases should be used to export with different names. If there are duplicate names, ctix will exclude all duplicates from the `index.ts` file and output a warning to alert the developer of the duplicate names. An example of this is `type03`.
