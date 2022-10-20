import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import appendDotDirPrefix from '@tools/appendDotDirPrefix';
import extensions from '@tools/extensions';
import getExtname from '@tools/getExtname';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

function isKeepExt({
  relativePath,
  declareExtensions,
  extname,
  isIndex,
}: {
  relativePath?: string;
  declareExtensions: string[];
  extname: string;
  isIndex: boolean;
}) {
  if (relativePath != null && declareExtensions.includes(extname)) {
    return true;
  }

  if (relativePath != null && isIndex && extname === '.tsx') {
    return true;
  }

  return false;
}

function getRelativePath(filePath: string, option: TCreateOrSingleOption, relativePath?: string) {
  const declareExtensions = extensions.filter((ext) => ext.startsWith('.d'));
  const extname = getExtname(filePath);
  const basename = path.basename(filePath, extname);
  const isIndex = basename.endsWith('index');

  if (isKeepExt({ relativePath, declareExtensions, extname, isIndex })) {
    if (relativePath == null) {
      throw new Error(`empty path: ${relativePath}`);
    }

    const relativeDirPath = replaceSepToPosix(
      path.posix.relative(relativePath, path.dirname(filePath)),
    );
    const exportPath = `${basename}${extname}`;
    const relativeDirPathWithDot = appendDotDirPrefix(
      path.posix.join(relativeDirPath, exportPath),
      path.posix.sep,
    );

    return relativeDirPathWithDot;
  }

  if (relativePath != null && option.keepFileExt) {
    const relativeDirPath = replaceSepToPosix(
      path.posix.relative(relativePath, path.dirname(filePath)),
    );
    const exportPath = isIndex ? '' : `${basename}${extname}`;
    const relativeDirPathWithDot = appendDotDirPrefix(
      path.posix.join(relativeDirPath, exportPath),
      path.posix.sep,
    );

    return relativeDirPathWithDot;
  }

  if (relativePath != null) {
    const relativeDirPath = replaceSepToPosix(
      path.posix.relative(relativePath, path.dirname(filePath)),
    );
    const exportPath = isIndex ? '' : `${basename}`;
    const relativeDirPathWithDot = appendDotDirPrefix(
      path.posix.join(relativeDirPath, exportPath),
      path.posix.sep,
    );

    return relativeDirPathWithDot;
  }

  if (option.keepFileExt || declareExtensions.includes(extname)) {
    const exportPath = isIndex ? '' : `${basename}${extname}`;
    const basenameWithDot = appendDotDirPrefix(exportPath, path.posix.sep);
    return basenameWithDot;
  }

  const basenameWithDot = appendDotDirPrefix(basename, path.posix.sep);
  return basenameWithDot;
}

export default function getFilePathOnIndex(
  filePath: string,
  option: TCreateOrSingleOption,
  relativePath?: string,
) {
  const semicolon = option.useSemicolon ? ';' : '';
  const relativeDirPath = getRelativePath(filePath, option, relativePath);
  return `${option.quote}${relativeDirPath}${option.quote}${semicolon}`;
}
