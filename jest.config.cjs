module.exports = {
  verbose: false,
  roots: ['<rootDir>/lib/', '<rootDir>/test/e2e'],
  moduleFileExtensions: ['js'],
  collectCoverage: false,
  reporters: ['jest-spec-reporter'],
  transform: { '\\.[jt]sx?$': 'babel-jest' },
  setupFiles: ['<rootDir>/test/config/setup.js']
}
