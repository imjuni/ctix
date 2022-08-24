---
lang: en-US
title: Single Command
description: ctix detail usage guide
---

Create an entrypoint index.ts file for use with webpack and rollup.js, typedoc

## single command option

| Name             | Short | Default  | Type                 | Required | Command |
| :--------------- | ----- | -------- | -------------------- | -------- | ------- |
| --config         | -c    |          | string               |          | single  |
| --project        | -p    |          | string               | required | single  |
| --exportFilename | -f    | index.ts | string               | required | single  |
| --useSemicolon   | -s    | true     | string               |          | single  |
| --useTimestamp   | -t    | false    | boolean              |          | single  |
| --useComment     | -m    | true     | boolean              |          | single  |
| --quote          | -q    | '        | string               |          | single  |
| --keepFileExt    | -k    | false    | boolean              |          | single  |
| --overwrite      | -w    | false    | boolean              |          | single  |
| --ignoreFile     | -g    |          | string               |          | single  |
| --output         | -o    |          | string               | required | single  |
| --useRootDir     | -r    | false    | boolean              |          | single  |
| --spinnerStream  |       | stdout   | enum(stdout, stderr) |          | single  |
| --progressStream |       | stdout   | enum(stdout, stderr) |          | single  |
| --reasonerStream |       | stderr   | enum(stdout, stderr) |          | single  |

## single command option description

| Name             | Description                                                                                                                    |
| :--------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| --config         | configuration file(.ctirc) path                                                                                                |
| --project        | tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"                                              |
| --exportFilename | Export filename, if you not pass this field that use "index.ts" or "index.d.ts"                                                |
| --useSemicolon   | add semicolon on line ending at every export statement                                                                         |
| --useTimestamp   | timestamp write on ctix comment right-side, only works in useComment option set true                                           |
| --useComment     | ctix comment add on first line of creted export file(default index.ts) file, that remark created from ctix                     |
| --quote          | change quote character at export syntax                                                                                        |
| --keepFileExt    | keep file extension on export statement path literal                                                                           |
| --overwrite      | overwrite each index.ts file                                                                                                   |
| --ignoreFile     | ignore file name. You can pass ignore, config file at ctix and use it like profile                                             |
| --output         | output directory                                                                                                               |
| --useRootDir     | output file under rootDir in tsconfig.json.                                                                                    |
| --spinnerStream  | Stream of cli spinner, you can pass stdout or stderr                                                                           |
| --progressStream | Stream of cli progress, you can pass stdout or stderr                                                                          |
| --reasonerStream | Stream of cli reasoner. Reasoner show name conflict error and already exist index.ts file error. You can pass stdout or stderr |
