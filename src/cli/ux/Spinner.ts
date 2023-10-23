import type { TStreamType } from '#/configs/interfaces/TStreamType';
import ora from 'ora';

export class Spinner {
  static #it: Spinner;

  static get it() {
    return Spinner.#it;
  }

  static #isBootstrap: boolean = false;

  static get isBootstrap() {
    return Spinner.#isBootstrap;
  }

  static bootstrap() {
    if (Spinner.#isBootstrap) {
      return;
    }

    const spinner = ora({ text: '', stream: process.stdout });
    const enable = false;
    const stream = 'stdout';

    Spinner.#it = new Spinner(spinner, stream, enable);
    Spinner.#isBootstrap = true;
  }

  #spinner: ora.Ora;

  #stream: TStreamType;

  #enable: boolean;

  constructor(spinner: ora.Ora, stream: TStreamType, enable: boolean) {
    this.#spinner = spinner;
    this.#enable = enable;
    this.#stream = stream;
  }

  set stream(value: TStreamType) {
    if (value !== this.#stream) {
      this.#spinner.stop();
      this.#spinner = ora({ text: this.#spinner.text, stream: process[value] });
      this.#stream = value;
    }
  }

  get enable() {
    return this.#enable;
  }

  set enable(value) {
    this.#enable = value;
  }

  start(message?: string) {
    if (this.#enable && message != null) {
      this.#spinner.text = message;
      this.#spinner.start();
    } else if (this.#enable) {
      this.#spinner.start();
    }
  }

  messaging(kind: 'succeed' | 'fail' | 'update', message: string) {
    if (!this.#enable) {
      return;
    }

    switch (kind) {
      case 'succeed':
        this.#spinner.succeed(message);
        break;
      case 'fail':
        this.#spinner.fail(message);
        break;
      default:
        this.#spinner.text = message;
    }
  }

  fail(message: string) {
    this.messaging('fail', message);
  }

  succeed(message: string) {
    this.messaging('succeed', message);
  }

  update(message: string) {
    this.messaging('update', message);
  }

  stop() {
    // this.#spinner.stopAndPersist();
    this.#spinner.stop();
  }
}

Spinner.bootstrap();
