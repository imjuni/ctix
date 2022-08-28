---
lang: en-US
title: Remove Command
description: ctix detail usage guide
---

Remove an entrypoint index.ts file on project directory

## remove command option

| Name             | Short | Default             | Type                 | Required | Command |
| :--------------- | ----- | ------------------- | -------------------- | -------- | ------- |
| --config         | -c    |                     | string               |          | remove  |
| --project        | -p    |                     | string               | required | remove  |
| --startAt        | -a    | use --project value | string               | required | remove  |
| --exportFilename | -f    | index.ts            | string               | required | remove  |
| --includeBackup  | -b    | false               | boolean              |          | remove  |
| --spinnerStream  |       | stdout              | enum(stdout, stderr) |          | remove  |
| --progressStream |       | stdout              | enum(stdout, stderr) |          | remove  |
| --reasonerStream |       | stderr              | enum(stdout, stderr) |          | remove  |

## remove command option description

| Name             | Description                                                                                                                    |
| :--------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| --config         | configuration file(.ctirc) path                                                                                                |
| --project        | tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"                                              |
| --startAt        | start working from startAt directory. If you do not pass startAt use project directory.                                        |
| --includeBackup  | remove with backup file                                                                                                        |
| --exportFilename | Export filename, if you not pass this field that use "index.ts" or "index.d.ts"                                                |
| --spinnerStream  | Stream of cli spinner, you can pass stdout or stderr                                                                           |
| --progressStream | Stream of cli progress, you can pass stdout or stderr                                                                          |
| --reasonerStream | Stream of cli reasoner. Reasoner show name conflict error and already exist index.ts file error. You can pass stdout or stderr |
