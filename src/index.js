/**
 * CF Security module
 * @module @nitra/cf-security
 */

/**
 * @const {Function}
 */
const checkEnv = require('@47ng/check-env').default
checkEnv({ required: ['X_NITRA_CF_KEY'] })

const log = require('loglevel-colored-level-prefix')()
log.debug('cfSecurity in DEBUG MODE')

/**
* Check request for Nitra security rules
*
* @param {object} req - ApolloServer or Express Request for check
* @return {boolean} if check passed
*/

exports.cfSecurity = function (req) {
  let cfKey
  // If this ApolloServer reqest
  if (typeof req.headers !== 'undefined') {
    if (typeof req.headers['x_nitra_cf_key'] === 'undefined') {
      log.debug(`Nitra key not exist in ApolloServer request`)
      return false
    }

    cfKey = req.headers['x_nitra_cf_key']
  } else {
    // Express request
    cfKey = req.get('x_nitra_cf_key')
  }

  if (cfKey.length === 0) {
    log.debug(`Empty Nitra key in headers request`)
    return false
  }

  if (cfKey !== process.env['X_NITRA_CF_KEY']) {
    log.debug(`Not equal Nitra key`)
    return false
  }

  return true
}
