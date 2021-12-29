const Sequencer = require('@jest/test-sequencer').default;
const debug = require('debug');
const path = require('path');

const log = debug('ctix:test-spec');

const testWeight = {
  'config.test.ts': 0,
  'file.test.ts': 1,
  'tsfile.test.ts': 2,
  'write.test.ts': 3,
  'clean.test.ts': 4,
};

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Test structure information
    // https://github.com/facebook/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21
    const copyTests = Array.from(tests);
    const testSize = copyTests.length;

    const sorted = copyTests.sort((left, right) => {
      const leftWeight = testSize - testWeight[path.basename(left.path)];
      const rightWeight = testSize - testWeight[path.basename(right.path)];
      return rightWeight - leftWeight;
    });

    log(
      '테스트: ',
      sorted.map((t) => t.path),
    );

    return sorted;
  }
}

module.exports = CustomSequencer;
