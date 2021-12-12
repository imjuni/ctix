module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/*.(ts|tsx)', '**/__test__/*.(ts|tsx)'],
  setupFilesAfterEnv: ['./jest.setup.cjs'],
  moduleNameMapper: {
    '^@tools/(.*)$': '<rootDir>/src/tools/$1',
    '^@options/(.*)$': '<rootDir>/src/options/$1',
  },
};
