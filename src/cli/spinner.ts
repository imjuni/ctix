import { isNotEmpty } from 'my-easy-fp';
import ora from 'ora';

const spinner = ora('');

let isMessageDisplay = false;

export function enable(flag: boolean) {
  isMessageDisplay = flag;
}

export function start(message?: string) {
  if (isMessageDisplay) {
    if (isNotEmpty(message)) {
      spinner.text = message;
    }

    spinner.start();
  }
}

export function update(message: string) {
  if (isMessageDisplay) {
    spinner.text = message;
  }
}

export function stop() {
  spinner.stopAndPersist();
}
