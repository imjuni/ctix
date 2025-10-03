# ctix Project Overview

---

**ctix** is an automated barrel file generation tool for TypeScript projects.

## Core Purpose

Created to eliminate the hassle of manually managing `index.ts` barrel files that organize exports in TypeScript library projects. It leverages the TypeScript Compiler API to automatically find functions, variables, and types with the export keyword throughout the project and generate barrel files.

## Key Features

- **Automatic export extraction**: Automatically extracts all declarations with the export keyword using the TypeScript Compiler API
- **3 generation modes**:
  - `bundle`: Generate a single barrel file
  - `create`: Generate barrel files per directory
  - `module`: Generate file-name-based barrel files for Vue, Svelte, etc.
- **Type safety**: Automatically adds the `type` keyword to interfaces and type aliases (e.g., `export { type IAmSuperHero }`)
- **Flexible exclusion**: Exclude specific files/statements using ESLint-style inline comments (`@ctix-exclude`)
- **Various export styles**: Support for different generation styles to handle default exports
- **Configuration management**: Create `.ctirc` configuration files via interactive prompts (`ctix init`)

## Tech Stack

- **Language**: TypeScript (Node.js 18+)
- **Core dependencies**:
  - `ts-morph`: TypeScript Compiler API wrapper
  - `prettier`, `prettier-plugin-organize-imports`: Code formatting
  - `yargs`: CLI interface
  - `glob`: File pattern matching
  - `eta`: Template engine

## Project Structure

```text
ctix/
├── src/                          # Source code
│   ├── cli/                      # CLI-related code
│   │   ├── builders/            # CLI command builders
│   │   ├── commands/            # CLI command implementations (build, init, remove, etc.)
│   │   ├── interfaces/          # CLI type definitions
│   │   ├── modules/             # CLI utility modules
│   │   ├── questions/           # Interactive prompt question definitions
│   │   └── ux/                  # UX-related (progress bars, logging, etc.)
│   ├── comments/                # JSDoc/comment parsing and processing
│   │   ├── __tests__/          # Comment processing unit tests
│   │   ├── const-enum/         # Comment-related constants and enums
│   │   └── interfaces/         # Comment-related type definitions
│   ├── compilers/               # TypeScript Compiler API wrapper
│   │   ├── __tests__/          # Compiler unit tests
│   │   └── interfaces/         # Compiler-related type definitions
│   ├── configs/                 # Configuration file management (.ctirc)
│   │   ├── __tests__/          # Configuration-related unit tests
│   │   ├── const-enum/         # Configuration-related constants and enums
│   │   ├── interfaces/         # Configuration-related type definitions
│   │   ├── modules/            # Configuration load/save modules
│   │   └── transforms/         # Configuration transformation logic
│   ├── errors/                  # Custom error classes
│   │   └── __tests__/          # Error-related unit tests
│   ├── modules/                 # Core business logic
│   │   ├── commands/           # Command execution logic (bundle, create, module)
│   │   ├── file/               # File system processing
│   │   ├── path/               # Path processing and matching
│   │   ├── scope/              # Export scope analysis
│   │   ├── values/             # Export value extraction
│   │   └── writes/             # Barrel file writing
│   ├── templates/               # Barrel file generation templates (Eta)
│   │   ├── __tests__/          # Template unit tests
│   │   ├── const-enum/         # Template-related constants and enums
│   │   ├── interfaces/         # Template-related type definitions
│   │   ├── modules/            # Template rendering logic
│   │   └── templates/          # .eta template files
│   ├── cli.ts                   # CLI entry point
│   └── index.ts                 # Library entry point (auto-generated)
├── .configs/                    # Build configuration
│   ├── esbuild.cli.mjs         # CLI bundle configuration (esbuild)
│   ├── esbuild.mjs             # Library bundle configuration (esbuild)
│   └── rollup.config.mjs       # Type definition bundle configuration (rollup-plugin-dts)
├── dist/                        # Build outputs
│   ├── cjs/                    # CommonJS build
│   │   ├── cli.cjs            # CLI executable
│   │   └── index.cjs          # Library CJS entry
│   ├── esm/                    # ES Module build
│   │   └── index.mjs          # Library ESM entry
│   └── types/                  # Type definition files
│       └── index.d.ts         # Unified type definitions
├── examples/                    # Example projects (type01~type13)
├── static/                      # Static files (images, docs, etc.)
├── .husky/                      # Git hooks (commitlint, lint-staged)
├── package.json                # Project metadata and scripts
├── tsconfig.json               # TypeScript base configuration
└── tsconfig.prod.json          # Production build configuration
```

### Key Directory Descriptions

#### src/cli/

CLI interface implementation. Handles command definitions using `yargs`, interactive prompts (`inquirer`), progress display, and more.

#### src/compilers/

Wrapper layer around the TypeScript Compiler API (`ts-morph`). Plays a core role in loading project files, AST analysis, and export statement extraction.

#### src/modules/commands/

Actual implementation of the three generation modes:

- **bundle**: Generate a single barrel file
- **create**: Generate barrel files per directory
- **module**: Generate file-name-based barrel files (for Vue/Svelte, etc.)

#### src/templates/

Barrel file generation using the Eta template engine. Supports various export styles (default export, named export, type-only export, etc.).

#### examples/

Test projects for various scenarios. Contains examples with different structures and requirements for each type.

## Build System

- **Bundler**: esbuild (simultaneous CJS, ESM builds)
- **Type definitions**: rollup + rollup-plugin-dts
- **Testing**: Vitest with coverage
- **Code quality**: ESLint, Prettier, lint-staged, Husky

## Use Cases

- Entry point management for TypeScript library projects
- Generate a single `index.d.ts` with rollup-plugin-dts
- Export management for React, Vue.js component libraries
- Preparation for webpack, rollup.js bundling

### Commit Log

- Use Conventional Commit format
- First line must not exceed 50 characters
- All commit messages must be written in English
- Include comprehensive description of changes in commit body

### Example Commit

```text
feat(config): enhance configuration file creation command

- add additional questions to the configuration file creation process:
  - include descriptive comments in the configuration file or not?
  - add only required options or all options?
  - create a backup of the `tsconfig.json` or `package.json` file or not?
- add a new json package to preserve comments:
  - add the comment-json package

## License

MIT License Open Source
```
