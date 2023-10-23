import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import dayjs from 'dayjs';

export function getBanner(
  option: Pick<TCreateOptions | TBundleOptions, 'useBanner' | 'useTimestamp'>,
  todayArgs?: dayjs.Dayjs,
): string | undefined {
  const today = todayArgs ?? dayjs();

  if (option.useBanner && option.useTimestamp) {
    return `// created from ctix ${today.format('YYYY-MM-DD HH:mm:ss')}`;
  }

  if (option.useBanner) {
    return `// created from ctix`;
  }

  return undefined;
}
