import os from 'os';

export function getRefineIgnorePath(filePath: string): string {
  if (os.platform() === 'win32') {
    const matched = /^([a-zA-Z]:)(\/|)(.+)$/.exec(filePath.trim());
    if (matched === null || matched === undefined || matched.length < 4) {
      return filePath.startsWith('/') ? filePath.substring(1) : filePath;
    }
    return matched[3];
  }

  return filePath.startsWith('/') ? filePath.substring(1) : filePath;
}
