import { runSecurityCookie } from './jwt-c.js'
import { runSecurityHeader } from './jwt.js'

/**
 * Check request for Nitra security з токеном в кукі
 * @param {object} req - Fastify  Request for check
 * @param {Array<string>} allowedRoles - Allowed roles
 * @returns {Promise<object>} token if check passed
 */
export default async (req, allowedRoles) => {
  // oxlint-disable-line require-await
  if (req.headers.authorization) {
    const authHeaders = req.headers.authorization.split(' ')
    // Якщо це Basic авторизація, то беремо токен з Cookie
    if (authHeaders[0] === 'Bearer') {
      return runSecurityHeader(req, allowedRoles)
    }
  }
  return runSecurityCookie(req, allowedRoles)
}
