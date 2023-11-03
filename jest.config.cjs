const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/*.(ts|tsx)', '**/__test__/*.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', 'example/', 'dist/'],
  setupFilesAfterEnv: ['<rootDir>/.configs/jest.setup.cjs'],
  moduleDirectories: ['node_modules', 'src', __dirname],
  moduleNameMapper: pathsToModuleNameMapper({ '#/*': ['src/*'] }, { prefix: '<rootDir>/' }),
};
