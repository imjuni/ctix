// for safety testing
export function getCwd() {
  // When running as an npm/pnpm script from a parent directory, the script runner
  // changes process.cwd() to the package root. pnpm/npm sets INIT_CWD to the
  // directory where the user originally invoked the command.
  // USE_INIT_CWD=true tells ctix to resolve paths against INIT_CWD instead of
  // the package root so that relative paths work as the user expects.
  if (process.env.USE_INIT_CWD === 'true' && process.env.INIT_CWD != null) {
    return process.env.INIT_CWD;
  }

  return process.cwd();
}
