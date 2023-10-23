/**
 * build mode
 * - create: create an `index.ts` file in each directory
 * - bundle: bundle all export information in one `index.ts` file
 */
export const CE_CTIX_BUILD_MODE = {
  CREATE_MODE: 'create',
  BUNDLE_MODE: 'bundle',
} as const;

export type CE_CTIX_BUILD_MODE = (typeof CE_CTIX_BUILD_MODE)[keyof typeof CE_CTIX_BUILD_MODE];
