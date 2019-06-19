/**
 * CF Securoty module
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
 * Represents a book.
 *
 * @param {object} req - The value for check
 * @return {boolean} if value equal env
 */
exports.cfSecurity = function (req) {

  if (typeof req.headers !== 'undefined') {
    log.debug(`Header not exist in request`)
    return false
  }

  if (typeof req.headers['x_nitra_cf_key']  !== 'undefined') {
    log.debug(`Nitra key not exist in headers request`)
    return false
  } 

  if (req.headers['x_nitra_cf_key'].length === 0) {
    log.debug(`Empty Nitra key in headers request`)
    return false
  } 


  if (req.headers['x_nitra_cf_key'] !== process.env['X_NITRA_CF_KEY']) {
    log.debug(`Not equal Nitra key`)
    return false
  } 

  return true
}
