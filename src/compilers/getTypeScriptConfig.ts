import path from 'path';
import ts from 'typescript';
/**
 * tsconfig.json file find in current working director or cli execute path
 *
 * @param project project directory
 */
export default function getTypeScriptConfig(project: string): ts.ParsedCommandLine {
  const parseConfigHost: ts.ParseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: true,
  };

  const configFile = ts.readConfigFile(project, ts.sys.readFile);

  const tsconfig = ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path.dirname(project),
  );

  // ts.ParsedCommandLine object already contains typescript file in project
  // consola.debug('tsconfig filenames: ', tsconfig.fileNames);

  return tsconfig;
}
