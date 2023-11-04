import type { TStreamType } from '#/configs/interfaces/TStreamType';
import chalk from 'chalk';
import { SingleBar } from 'cli-progress';

export class ProgressBar {
  static #it: ProgressBar;

  static get it() {
    return ProgressBar.#it;
  }

  static #isBootstrap: boolean = false;

  static get isBootstrap() {
    return ProgressBar.#isBootstrap;
  }

  static bootstrap() {
    if (ProgressBar.#isBootstrap) {
      return;
    }

    const stream = 'stdout';

    const isEnable = false;

    const bar = new SingleBar({
      format: `Progress [${chalk.green('{bar}')}] {percentage}% | {value}/{total}`,
      barCompleteChar: '\u25A0',
      barIncompleteChar: ' ',
      stopOnComplete: true,
      barsize: 40,
      stream: process.stdout,
    });

    ProgressBar.#it = new ProgressBar(bar, stream, isEnable);
    ProgressBar.#isBootstrap = true;
  }

  #bar: SingleBar;

  #stream: TStreamType;

  #enable: boolean;

  #head: string;

  constructor(bar: SingleBar, stream: TStreamType, enable: boolean) {
    this.#bar = bar;
    this.#stream = stream;
    this.#enable = enable;
    this.#head = 'Progress ';
  }

  set stream(value: TStreamType) {
    if (value !== this.#stream) {
      this.#bar.stop();

      this.#bar = new SingleBar({
        format: `${this.#head}[${chalk.green('{bar}')}] {percentage}% | {value}/{total}`,
        barCompleteChar: '\u25A0',
        barIncompleteChar: ' ',
        stopOnComplete: true,
        barsize: 40,
        stream: process[value],
      });

      this.#stream = value;
    }
  }

  get enable() {
    return this.#enable;
  }

  set enable(value) {
    this.#enable = value;
  }

  get head() {
    return this.#head;
  }

  set head(value) {
    this.#head = value;

    this.#bar = new SingleBar({
      format: `${this.#head}[${chalk.green('{bar}')}] {percentage}% | {value}/{total}`,
      barCompleteChar: '\u25A0',
      barIncompleteChar: ' ',
      stopOnComplete: true,
      barsize: 40,
      stream: process[this.#stream],
    });
  }

  start(max: number, initial?: number) {
    if (this.#enable) {
      this.#bar.start(max, initial ?? 0);
    }
  }

  increment() {
    if (this.#enable) {
      this.#bar.increment();
    }
  }

  update(current: number) {
    if (this.#enable) {
      this.#bar.update(current);
    }
  }

  stop() {
    this.#bar.update(this.#bar.getTotal());
    this.#bar.stop();
  }
}

ProgressBar.bootstrap();
