export const CE_AUTO_RENDER_CASE = {
  // case 01.
  // default export (o)
  // named export   (o)
  // partial ignore (x)
  DEFAULT_NAMED: 1,

  // case 02.
  // default export (o)
  // named export   (x)
  // partial ignore (x)
  DEFAULT: 2,

  // case 03.
  // default export (x)
  // named export   (o)
  // partial ignore (x)
  NAMED: 3,

  // case 04.
  // default export (x)
  // named export   (o)
  // partial ignore (o)
  //
  // - partial ignore apply on default export
  // - partial ignore apply on named export and dosen't have a default export
  NAMED_PARTAL: 4,

  // case 05.
  // default export (o)
  // named export   (x)
  // partial ignore (o)
  //
  // - partial ignore apply on named export
  // - named export item only one
  DEFAULT_PARTIAL: 5,

  // case 06.
  // default export (o)
  // named export   (o)
  // partial ignore (o)
  //
  // - partial ignore apply on named export
  // - named export item more then one
  DEFAULT_NAMED_PARTIAL: 6,

  // unknown
  UNKNOWN: Number.MAX_SAFE_INTEGER,
} as const;

export type CE_AUTO_RENDER_CASE = (typeof CE_AUTO_RENDER_CASE)[keyof typeof CE_AUTO_RENDER_CASE];
