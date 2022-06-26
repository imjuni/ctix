/* eslint-disable no-console */
import IReason from '@cli/interfaces/IReason';
import colors from 'colors';
import { isEmpty, isFalse, sleep as sleepMs } from 'my-easy-fp';
import * as path from 'path';

let isMessageDisplay = false;

export function enable(flag: boolean) {
  isMessageDisplay = flag;
}

export async function sleep(ms: number): Promise<void> {
  if (isMessageDisplay) {
    await sleepMs(ms);
  }
}

export function space(): void {
  if (isFalse(isMessageDisplay)) {
    return;
  }

  console.log('');
}

export function start(reasons: IReason[]): void {
  if (isFalse(isMessageDisplay)) {
    return;
  }

  console.log('');

  reasons.forEach((reason) => {
    const typeMessage =
      reason.type === 'error'
        ? colors.bgRed(`   ${reason.type.toUpperCase()}   `)
        : colors.bgYellow(`   ${reason.type.toUpperCase()}    `);

    const { filePath } = reason;

    const filename = isEmpty(reason.lineAndCharacter)
      ? `${path.basename(filePath)}`
      : `${path.basename(filePath)}:${reason.lineAndCharacter.line}:${
          reason.lineAndCharacter.character
        }`;

    const chevronRight = reason.type === 'error' ? colors.red('>') : colors.yellow('>');

    console.log(typeMessage, filename);

    if (isEmpty(reason.lineAndCharacter)) {
      console.log(`   ${chevronRight} ${colors.gray(`${filePath}`)}`);
    } else {
      console.log(
        `   ${chevronRight} ${colors.gray(
          `${filePath}:${reason.lineAndCharacter.line}:${reason.lineAndCharacter.character}`,
        )}`,
      );
    }
    reason.message.split('\n').forEach((splittedMessage) => {
      console.log(`   ${chevronRight} ${colors.gray(splittedMessage.trim())}`);
    });

    console.log('');
  });
}
