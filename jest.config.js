/* eslint-disable semi */
/* eslint-disable comma-dangle */

module.exports = {
  clearMocks: true,

  roots: ['<rootDir>/src'],
  collectCoverage: true,

  collectCoverageFrom: ['<rootDir>/src/**/*ts'],
  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  transform: {
    '.*\\.ts': 'ts-jest',
  },
};
