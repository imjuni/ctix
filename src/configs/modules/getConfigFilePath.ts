import { exists } from 'my-node-fp';
import pathe from 'pathe';

export async function getConfigFilePath(fileName: string, configFilePath?: string) {
  if (configFilePath != null) {
    return configFilePath;
  }

  const cwdConfigFilePath = pathe.join(process.cwd(), fileName);

  if (await exists(cwdConfigFilePath)) {
    return cwdConfigFilePath;
  }

  return undefined;
}
