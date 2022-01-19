/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/pages/api/**/*',
    '!<rootDir>/src/pages/poc/**/*',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
  },
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
};

module.exports = config;
