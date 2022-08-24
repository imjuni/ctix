import TStreamType from '@configs/interfaces/TStreamType';
import chalk from 'chalk';
import { SingleBar } from 'cli-progress';

class CtixProgress {
  #bar: SingleBar;

  #stream: TStreamType;

  #isEnable: boolean;

  constructor() {
    this.#bar = new SingleBar({
      format: `Progress [${chalk.green('{bar}')}] {percentage}% | {value}/{total}`,
      barCompleteChar: '\u25A0',
      barIncompleteChar: ' ',
      stopOnComplete: true,
      barsize: 40,
      stream: process.stderr,
    });

    this.#stream = 'stderr';

    this.#isEnable = false;
  }

  set stream(value: TStreamType) {
    if (value === 'stderr' && this.#stream === 'stdout') {
      this.#bar.stop();

      this.#bar = new SingleBar({
        format: `Progress [${chalk.green('{bar}')}] {percentage}% | {value}/{total}`,
        barCompleteChar: '\u25A0',
        barIncompleteChar: ' ',
        stopOnComplete: true,
        barsize: 40,
        stream: process.stderr,
      });

      this.#stream = 'stderr';
    } else if (value === 'stdout' && this.#stream === 'stderr') {
      this.#bar.stop();

      this.#bar = new SingleBar({
        format: `Progress [${chalk.green('{bar}')}] {percentage}% | {value}/{total}`,
        barCompleteChar: '\u25A0',
        barIncompleteChar: ' ',
        stopOnComplete: true,
        barsize: 40,
        stream: process.stdout,
      });

      this.#stream = 'stdout';
    }
  }

  get isEnable() {
    return this.#isEnable;
  }

  set isEnable(value) {
    this.#isEnable = value;
  }

  start(max: number, initial: number) {
    if (this.#isEnable) {
      this.#bar.start(max, initial);
    }
  }

  increment() {
    if (this.#isEnable) {
      this.#bar.increment();
    }
  }

  update(current: number) {
    if (this.#isEnable) {
      this.#bar.update(current);
    }
  }

  stop() {
    this.#bar.stop();
  }
}

const progress = new CtixProgress();

export default progress;
