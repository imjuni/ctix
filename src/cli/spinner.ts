import TStreamType from '@configs/interfaces/TStreamType';
import { isNotEmpty } from 'my-easy-fp';
import ora from 'ora';

class CtixSpinner {
  #spinner: ora.Ora;

  #stream: TStreamType;

  #isEnable: boolean;

  constructor() {
    this.#spinner = ora({ text: '', stream: process.stdout });
    this.#isEnable = false;
    this.#stream = 'stdout';
  }

  set stream(value: TStreamType) {
    if (value === 'stderr' && this.#stream === 'stdout') {
      this.#spinner.stop();
      this.#spinner = ora({ text: this.#spinner.text, stream: process.stderr });

      this.#stream = 'stderr';
    } else if (value === 'stdout' && this.#stream === 'stderr') {
      this.#spinner.stop();
      this.#spinner = ora({ text: this.#spinner.text, stream: process.stdout });

      this.#stream = 'stdout';
    }
  }

  get isEnable() {
    return this.#isEnable;
  }

  set isEnable(value) {
    this.#isEnable = value;
  }

  start(message?: string) {
    if (this.#isEnable && isNotEmpty(message)) {
      this.#spinner.text = message;
      this.#spinner.start();
    } else if (this.#isEnable) {
      this.#spinner.start();
    }
  }

  update(message: string) {
    if (this.#isEnable) {
      this.#spinner.text = message;
    }
  }

  stop() {
    this.#spinner.stopAndPersist();
  }
}

const spinner = new CtixSpinner();

export default spinner;
