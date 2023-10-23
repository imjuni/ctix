import { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import { atOrUndefined, toArray } from 'my-easy-fp';

export function getCommand(raw: (string | number)[]): CE_CTIX_COMMAND {
  const command = atOrUndefined(toArray(raw), 0);

  switch (command) {
    case CE_CTIX_COMMAND.BUILD_COMMAND:
    case CE_CTIX_COMMAND.BUILD_COMMAND_ALIAS:
      return CE_CTIX_COMMAND.BUILD_COMMAND;
    case CE_CTIX_COMMAND.REMOVE_COMMAND:
    case CE_CTIX_COMMAND.REMOVE_COMMAND_ALIAS:
      return CE_CTIX_COMMAND.REMOVE_COMMAND;
    case CE_CTIX_COMMAND.INIT_COMMAND:
    case CE_CTIX_COMMAND.INIT_COMMAND_ALIAS:
      return CE_CTIX_COMMAND.INIT_COMMAND;
    default:
      throw new Error();
  }
}
