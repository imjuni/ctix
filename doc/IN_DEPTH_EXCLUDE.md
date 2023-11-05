# Setting up input files in `ctix`

This document describe about how to migrate from 1.x version of how to set up exclusion files and how to set up 2.x version of exclusion files. If you don't need instructions on how to migrate, skip ahead to How to set up [2.x version exclusion files](#include-exclude).

## Why removed `.ctiignore` file in `ctix`?

Starting with version 2.x, `ctix` changed to setting input files and exclusion files in the `.ctirc` file. Setting input exclusion files is an essential feature for code auto-generation tools like `ctix`. Until version 1.x, the `.ctiignore` file was used to organize exclusion files.

The `.ctiignore` file was in JSON format with a glob pattern in the Object key and the name of the export statement you want to exclude in the Object value. While this is easy to set up, there are some logical problems.

```json
{
  "!marvel-hero/**/*.ts": ["batman"]
}
```

Let's say we have the following configuration: The key part uses the `!` character to set the file to exclude. On the other hand, the value part also wants to exclude the statement `batman`. It is semantically ambiguous whether the file is included and only the `batman` statement is excluded, whether both are excluded, or whether it makes no sense for the `batman` statement to be excluded because the file is already excluded. This ambiguity makes the results unpredictable and users wondering about the exact behavior.

The `tsconfig.json` file uses `include` and `exclude` settings to explicitly set inclusion and exclusion files. Because it distinguishes between include and exclude, the meaning is clear even when using the `!` glob pattern. `ctix` borrows this approach and adds include and exclude settings to the `.ctirc` file to set include and exclude files. However, this means that when you want to exclude only certain statements from a file, you have to separate the file to set the exclude settings.

If you only want to add specific statements to the file, you can add the `@ctix-exclude-next` keyword to the comment to exclude only specific statements. This is a development of what was suggested in [issue #80](https://github.com/imjuni/ctix/issues/80).

## migration guide

First, back up the `.ctirc` file you were using.

```bash
cp .ctirc .ctirc.bak
npx ctix init
```

Since version 2.x adds so many features, we recommend running the initialization command and then migrating your existing options. After that, find the exclude field and add the file list part of the `.ctiignore` content you were using, and the key part of Object to exclude. If you were using the partial exclude feature to exclude only certain export statements, open the source file with the export statement you want to exclude and comment out `@ctix-exclude-next`.

## include, exclude

The `ctix` now sets the include, exclude files in the `.ctirc` file rather than in a separate file.

### `.ctirc`

I've applied `ctix` to many of the projects I'm working on, and while working on these projects, I realized that it's not convenient to manage exclusion files in a separate file like `.ctiignore` - it's more files to manage, and I don't like having to keep entering the `.ctiignore` file every time I run the CLI. So I moved all the settings to the `.ctirc` file.

The include, exclude settings are exactly the same as how to set include, exclude in the tsconfig.json file. Moreover, if you don't have include, exclude settings, it will import the tsconfig.json settings, in which case the settings will change according to the tsconfig.json file settings, so be careful.

`.ctirc`

```json
{
  "options": [
    {
      "mode": "bundle",
      "project": "tsconfig.json",
      "include": ["src/**/*.ts"],
      "exclude": ["dist/**", ".configs/**"],
    }
  ]
}
```

Include and exclude settings are handled by [glob pattern](https://github.com/isaacs/node-glob), so you can also use glob patterns like the one below.

```json
{
  "options": [
    {
      "mode": "bundle",
      "project": "tsconfig.json",
      "include": [
        "src/cli/**/*.ts",
        "src/compilers/**/*.ts",
        "!src/compilers/getTypeScriptProject.ts",
        "examples/**/*.ts",
      ],
      "exclude": ["dist/**", ".configs/**"],
    }
  ]
}
```

The include and exclude settings can be set on a per-file basis, so if you want to exclude only certain functions, variables in a file, you should use the [inline ignore](#inline-ignore-in-document-comment) setting described in the next section.

### inline ignore in document comment

It's easy to create ambiguity by setting a partial exclude in a separate file, setting, so we'll add the exclude setting to a comment in the source code, like this

```ts
export class Hero {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

export class Ability {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}

/** @ctix-exclude-next */
export class Organization {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }
}
```

It supports two keywords: `@ctix-exclude` and `@ctix-exclude-next`. The `@ctix-exclude` sets the entire file as an exclude file, regardless of its location. The `@ctix-exclude-next` sets the next statement as a partial exclude. It does not exclude the entire file, but excludes the export statement.
