/* eslint-disable no-console */
const RELEASE_MODE = Boolean(process.env.RELEASE_MODE ?? 'false');

if (RELEASE_MODE === false) {
  console.log('Run `npm run release` to publish the package');
  process.exit(1); // which terminates the publish process
}
