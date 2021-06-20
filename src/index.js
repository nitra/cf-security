/**
 * CF Security module
 *
 * @module @nitra/cf-security
 */

const consola = require('consola')

/**
 * @const {Function}
 */
const checkEnv = require('@47ng/check-env').default
checkEnv({ required: ['X_NITRA_CF_KEY'] })

consola.debug('cfSecurity in DEBUG MODE')

/**
 * Check request for Nitra security rules
 *
 * @param {object} req - ApolloServer or Express Request for check
 * @return {boolean} if check passed
 */

exports.cfSecurity = function (req) {
  if (typeof req.headers === 'undefined') {
    consola.debug('Request without headers')
    return false
  }

  if (typeof req.headers['x-nitra-cf-key'] === 'undefined') {
    consola.debug('Nitra key not exist in request')
    return false
  }

  if (req.headers['x-nitra-cf-key'] === 0) {
    consola.debug('Empty Nitra key in headers request')
    return false
  }

  if (req.headers['x-nitra-cf-key'] !== process.env.X_NITRA_CF_KEY) {
    consola.debug('Not equal Nitra key')
    return false
  }

  return true
}
