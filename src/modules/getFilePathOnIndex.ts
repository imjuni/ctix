import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import appendDotDirPrefix from '@tools/appendDotDirPrefix';
import extensions from '@tools/extensions';
import getExtname from '@tools/getExtname';
import { isEmpty, isNotEmpty } from 'my-easy-fp';
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
  if (isNotEmpty(relativePath) && declareExtensions.includes(extname)) {
    return true;
  }

  if (isNotEmpty(relativePath) && isIndex && extname === '.tsx') {
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
    if (isEmpty(relativePath)) {
      throw new Error(`empty path: ${relativePath}`);
    }

    const relativeDirPath = replaceSepToPosix(
      path.relative(relativePath, filePath.replace(path.basename(filePath), '')),
    );
    const exportPath = `${path.posix.sep}${basename}${extname}`;
    const relativeDirPathWithDot = `${appendDotDirPrefix(
      relativeDirPath,
      path.posix.sep,
    )}${exportPath}`;

    return relativeDirPathWithDot;
  }

  if (isNotEmpty(relativePath) && option.keepFileExt) {
    const relativeDirPath = replaceSepToPosix(
      path.relative(relativePath, filePath.replace(path.basename(filePath), '')),
    );
    const exportPath = isIndex ? '' : `${path.posix.sep}${basename}${extname}`;
    const relativeDirPathWithDot = `${appendDotDirPrefix(
      relativeDirPath,
      path.posix.sep,
    )}${exportPath}`;

    return relativeDirPathWithDot;
  }

  if (isNotEmpty(relativePath)) {
    const relativeDirPath = replaceSepToPosix(
      path.relative(relativePath, filePath.replace(path.basename(filePath), '')),
    );
    const exportPath = isIndex ? '' : `${path.posix.sep}${basename}`;

    const relativeDirPathWithDot = `${appendDotDirPrefix(
      relativeDirPath,
      path.posix.sep,
    )}${exportPath}`;

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
