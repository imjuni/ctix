import { SingleBar } from 'cli-progress';
import colors from 'colors';

const progressBar = new SingleBar({
  format: `Progress [${colors.green('{bar}')}] {percentage}% | {value}/{total}`,
  barCompleteChar: '\u25A0',
  barIncompleteChar: ' ',
  stopOnComplete: true,
  barsize: 40,
});

let isMessageDisplay = false;

export function enable(flag: boolean) {
  isMessageDisplay = flag;
}

export function start(max: number, initial: number) {
  if (isMessageDisplay) {
    progressBar.start(max, initial);
  }
}

export function increment() {
  if (isMessageDisplay) {
    progressBar.increment();
  }
}

export function update(current: number) {
  if (isMessageDisplay) {
    progressBar.update(current);
  }
}

export function stop() {
  progressBar.stop();
}
