const assert = require('assert')

const testUtils = require('./test')

const throwError = (code, message) => {
  const err = new Error(message)
  err.code = code
  throw err
}

module.exports = {
  assert,
  testUtils,
  throwError,
}
