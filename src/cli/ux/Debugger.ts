import fs from 'node:fs';
import path from 'node:path';

export class Debugger {
  static #it: Debugger;

  static #isBootstrap: boolean = false;

  static get it() {
    return Debugger.#it;
  }

  static get isBootstrap() {
    return Debugger.#isBootstrap;
  }

  static bootstrap() {
    if (Debugger.#isBootstrap) {
      return;
    }

    Debugger.#it = new Debugger(false, undefined);
    Debugger.#isBootstrap = true;
  }

  #enable: boolean;

  #logFile: string | undefined;

  #stream: fs.WriteStream | undefined;

  constructor(enable: boolean, logFile: string | undefined) {
    this.#enable = enable;
    this.#logFile = logFile;
  }

  get enable() {
    return this.#enable;
  }

  set enable(value: boolean) {
    this.#enable = value;

    if (this.#logFile != null && value) {
      this.#openStream();
    }
  }

  set logFile(filePath: string | undefined) {
    this.#logFile = filePath;

    if (filePath != null && this.#enable) {
      this.#openStream();
    }
  }

  #openStream() {
    if (this.#logFile == null) {
      return;
    }

    const logDir = path.dirname(this.#logFile);

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.#stream = fs.createWriteStream(this.#logFile, { flags: 'a' });
  }

  log(message: string) {
    if (!this.#enable) {
      return;
    }

    const line = `[DEBUG] ${message}`;
    process.stderr.write(`${line}\n`);

    if (this.#stream != null) {
      this.#stream.write(`${line}\n`);
    }
  }

  logList(label: string, items: string[]) {
    if (!this.#enable) {
      return;
    }

    this.log(`${label} (${items.length}):`);

    if (items.length === 0) {
      this.log('  (empty)');
    } else {
      for (const item of items) {
        this.log(`  - ${item}`);
      }
    }
  }

  table(label: string, entries: [string, unknown][]) {
    if (!this.#enable) {
      return;
    }

    this.log(`${label}:`);

    for (const [key, value] of entries) {
      this.log(`  ${key} => ${String(value)}`);
    }
  }

  close() {
    if (this.#stream != null) {
      this.#stream.end();
      this.#stream = undefined;
    }
  }
}

Debugger.bootstrap();
