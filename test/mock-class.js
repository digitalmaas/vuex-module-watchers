/* global jest */

export default function mockClass (functionNames) {
  if (!Array.isArray(functionNames)) {
    functionNames = [functionNames]
  }
  function MockedKlass () {}
  const functionNamesLenght = functionNames.length
  for (let i = 0; i < functionNamesLenght; i++) {
    const name = functionNames[i]
    MockedKlass.prototype[name] = jest.fn()
  }
  return MockedKlass
}
