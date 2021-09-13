module.exports = {
  verbose: false,
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  moduleFileExtensions: ['js'],
  collectCoverage: false,
  reporters: ['jest-spec-reporter'],
  transform: { '\\.[jt]sx?$': 'babel-jest' }
}
