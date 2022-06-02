import chalk from 'chalk';
import { SingleBar } from 'cli-progress';

const progressBar = new SingleBar({
  format: `Progress [${chalk.green('{bar}')}] {percentage}% | {value}/{total}`,
  barCompleteChar: '\u25A0',
  barIncompleteChar: ' ',
  stopOnComplete: true,
  barsize: 40,
});

export function start(max: number, initial: number) {
  progressBar.start(max, initial);
}

export function increment() {
  progressBar.increment();
}

export function update(current: number) {
  progressBar.update(current);
}

export function stop() {
  progressBar.stop();
}
