import path from 'path';
import ts from 'typescript';

/**
 * tsconfig.json file find in current working director or cli execute path
 *
 * @param project - project directory
 */
export default function getTypeScriptConfig(project: string): ts.ParsedCommandLine {
  const resolvedProjectPath = path.resolve(project);
  const parseConfigHost: ts.ParseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: true,
  };

  const configFile = ts.readConfigFile(resolvedProjectPath, ts.sys.readFile);

  const tsconfig = ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path.dirname(resolvedProjectPath),
  );

  return tsconfig;
}
