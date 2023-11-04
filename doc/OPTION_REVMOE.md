# remove command option

| Property         | Type          | Default    | Required | Description                                                                                       | Command           | Mode               |
| ---------------- | ------------- | ---------- | :------: | ------------------------------------------------------------------------------------------------- | ----------------- | ------------------ |
| `config`         | `string`      |            |   Yes    | Configuration file (.ctirc) path.                                                                 | `build`, `remove` | `bundle`, `create` |
| `spinnerStream`  | `TStreamType` | `stdout`   |    No    | Stream of CLI spinner. Options are `stdout` or `stderr`.                                          | `build`, `remove` | `bundle`, `create` |
| `progressStream` | `TStreamType` | `stdout`   |    No    | Stream of CLI progress. Options are `stdout` or `stderr`.                                         | `build`, `remove` | `bundle`, `create` |
| `reasonerStream` | `TStreamType` | `stderr`   |    No    | Stream of CLI reasoner, showing name conflict errors and already existing `index.ts` file errors. | `build`, `remove` | `bundle`, `create` |
| `exportFilename` | `string`      | `index.ts` |    No    | Export filename, defaults to "index.ts" or "index.d.ts" if not provided.                          | `build`, `remove` | `bundle`, `create` |
| `exportFilename` | `string`      | `index.ts` |    No    | The filename used for export. Uses "index.ts" by default if not provided.                         | `build`, `remove` | `bundle`, `create` |
| `removeBackup`   | `boolean`     | `false`    |    No    | If true, remove along with backup file.                                                           | `remove`          |                    |
| `forceYes`       | `boolean`     | `false`    |    No    | Answer `yes` to all prompts during removal.                                                       | `remove`          |                    |

**Note:** `TStreamType` is a TypeScript type derived from the properties of the Node.js `process` object, specifically extracting the `stdout` and `stderr` streams.
