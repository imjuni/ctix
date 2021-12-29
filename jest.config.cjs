module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/*.(ts|tsx)', '**/__test__/*.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', 'example'],
  setupFilesAfterEnv: ['./jest.setup.cjs'],
  testSequencer: './test.spec.cjs',
  moduleNameMapper: {
    '^@tools/(.*)$': '<rootDir>/src/tools/$1',
    '^@options/(.*)$': '<rootDir>/src/options/$1',
  },
};
