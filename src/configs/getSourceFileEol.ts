import fs from 'fs';
import { isEmpty, isNotEmpty } from 'my-easy-fp';
import os from 'os';

// https://stackoverflow.com/questions/34820267/detecting-type-of-line-breaks
export function getEOL(text: string) {
  const eolMatched = text.match(/\r\n|\n/g);

  if (isEmpty(eolMatched)) {
    return os.EOL;
  }

  const numOfNl = eolMatched.filter((eol) => eol === '\n').length;
  const numOfCr = eolMatched.length - numOfNl;

  if (numOfNl === numOfCr) {
    return os.EOL; // use the OS default
  }

  return numOfNl > numOfCr ? '\n' : '\r\n';
}

export default async function getSourceFileEol(sourceFiles: string[]): Promise<string> {
  const eols = (
    await Promise.all(
      sourceFiles.map(async (srouceFile) => {
        try {
          const buf = await fs.promises.readFile(srouceFile);
          const eol = getEOL(buf.toString());
          return eol;
        } catch {
          return undefined;
        }
      }),
    )
  ).filter((eol): eol is string => isNotEmpty(eol));

  const eolRecord = eols.reduce<Record<string, number>>((aggregated, eol) => {
    return { ...aggregated, [eol]: (aggregated[eol] ?? 0) + 1 };
  }, {});

  const eolWithWeight = Object.entries(eolRecord).reduce(
    (max, eolPair) => {
      const [eolCharacter, weight] = eolPair;

      if (max.weight < (weight ?? Number.MIN_SAFE_INTEGER)) {
        return { eol: eolCharacter, weight };
      }

      return max;
    },
    {
      eol: os.EOL,
      weight: Number.MIN_SAFE_INTEGER,
    },
  );

  return eolWithWeight.eol;
}
