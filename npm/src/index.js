import { checkEnv, env } from '@nitra/check-env'

checkEnv(['X_NITRA_CF_KEY'])

/**
 * Check request for Nitra security rules
 * @param {object} req - ApolloServer or Express Request for check
 * @returns {boolean} if check passed
 */
export default function (req) {
  if (req.headers === undefined) {
    req.log.info('Request without headers')
    return false
  }

  if (req.headers['x-nitra-cf-key'] === undefined) {
    req.log.info('Nitra key not exist in request')
    return false
  }

  if (req.headers['x-nitra-cf-key'] === 0) {
    req.log.info('Empty Nitra key in headers request')
    return false
  }

  if (req.headers['x-nitra-cf-key'] !== env.X_NITRA_CF_KEY) {
    req.log.info('Not equal Nitra key')
    return false
  }

  return true
}
