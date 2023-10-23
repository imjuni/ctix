import { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import { getImportStatementRemoveExtname } from '#/modules/path/getImportStatementRemoveExtname';
import { getImportStatementReplaceJs } from '#/modules/path/getImportStatementReplaceJs';

export function getImportStatementExtname(
  option: CE_EXTENSION_PROCESSING,
  extname: string,
): string {
  switch (option) {
    case CE_EXTENSION_PROCESSING.KEEP_EXTENSION:
      return extname;
    case CE_EXTENSION_PROCESSING.REPLACE_JS:
      return getImportStatementReplaceJs(extname);
    default:
      return getImportStatementRemoveExtname(extname);
  }
}
