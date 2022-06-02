import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getExtname from '@tools/getExtname';
import { isNotEmpty } from 'my-easy-fp';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

function getRelativePath(filePath: string, option: TCreateOrSingleOption, relativePath?: string) {
  const extname = getExtname(filePath);
  const basename = path.basename(filePath, extname);
  const isIndex = basename.endsWith('index');

  if (isNotEmpty(relativePath) && option.keepFileExt) {
    const relativeDirPath = replaceSepToPosix(
      path.relative(relativePath, filePath.replace(path.basename(filePath), '')),
    );
    const exportPath = isIndex ? '' : `${path.posix.sep}${basename}${extname}`;

    const relativeDirPathWithDot = relativeDirPath.startsWith('.')
      ? `${relativeDirPath}${exportPath}`
      : `.${path.posix.sep}${relativeDirPath}${exportPath}`;

    return relativeDirPathWithDot;
  }

  if (isNotEmpty(relativePath)) {
    const relativeDirPath = replaceSepToPosix(
      path.relative(relativePath, filePath.replace(path.basename(filePath), '')),
    );
    const exportPath = isIndex ? '' : `${path.posix.sep}${basename}`;

    const relativeDirPathWithDot = relativeDirPath.startsWith('.')
      ? `${relativeDirPath}${exportPath}`
      : `.${path.posix.sep}${relativeDirPath}${exportPath}`;

    return relativeDirPathWithDot;
  }

  if (option.keepFileExt) {
    const exportPath = isIndex ? '' : `${basename}${extname}`;
    const basenameWithDot = basename.startsWith('.')
      ? `${exportPath}`
      : `.${path.posix.sep}${exportPath}`;

    return basenameWithDot;
  }

  const basenameWithDot = basename.startsWith('.') ? basename : `.${path.posix.sep}${basename}`;
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
