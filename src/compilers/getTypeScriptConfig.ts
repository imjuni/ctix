import path from 'node:path';
import * as tsm from 'ts-morph';

/**
 * tsconfig.json file find in current working director or cli execute path
 *
 * @param project - project directory
 */
export function getTypeScriptConfig(project: string): tsm.ts.ParsedCommandLine {
  const resolvedProjectPath = path.resolve(project);
  const parseConfigHost: tsm.ts.ParseConfigHost = {
    fileExists: tsm.ts.sys.fileExists.bind(tsm.ts),
    readFile: tsm.ts.sys.readFile.bind(tsm.ts),
    readDirectory: tsm.ts.sys.readDirectory.bind(tsm.ts),
    useCaseSensitiveFileNames: true,
  };

  const configFile = tsm.ts.readConfigFile(resolvedProjectPath, tsm.ts.sys.readFile.bind(tsm.ts));

  const tsconfig = tsm.ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path.dirname(resolvedProjectPath),
  );

  return tsconfig;
}
