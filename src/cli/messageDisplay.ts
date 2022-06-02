/* eslint-disable no-console */
import IReason from '@cli/interfaces/IReason';
import chalk from 'chalk';
import { isEmpty } from 'my-easy-fp';
import * as path from 'path';

export default function messageDisplay(reasons: IReason[]): void {
  console.log('');

  reasons.forEach((reason) => {
    const typeMessage =
      reason.type === 'error'
        ? chalk.bgRed(`   ${reason.type.toUpperCase()}   `)
        : chalk.bgYellow(`   ${reason.type.toUpperCase()}    `);

    const { filePath } = reason;

    const filename = isEmpty(reason.lineAndCharacter)
      ? `${path.basename(filePath)}`
      : `${path.basename(filePath)}:${reason.lineAndCharacter.line}:${
          reason.lineAndCharacter.character
        }`;

    const chevronRight = reason.type === 'error' ? chalk.red('>') : chalk.yellow('>');

    console.log(typeMessage, filename);

    if (isEmpty(reason.lineAndCharacter)) {
      console.log(`   ${chevronRight} ${chalk.gray(`${filePath}`)}`);
    } else {
      console.log(
        `   ${chevronRight} ${chalk.gray(
          `${filePath}:${reason.lineAndCharacter.line}:${reason.lineAndCharacter.character}`,
        )}`,
      );
    }
    reason.message.split('\n').forEach((splittedMessage) => {
      console.log(`   ${chevronRight} ${chalk.gray(splittedMessage.trim())}`);
    });

    console.log('');
  });
}
