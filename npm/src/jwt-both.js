import { runSecurityHeader } from './jwt.js'
import { runSecurityCookie } from './jwt-c.js'

/**
 * Check request for Nitra security з токеном в кукі
 *
 * @param {object} req - Fastify  Request for check
 * @return {Promise<Object>} token if check passed
 */
export default async (req, allowedRoles) => {
  if (req.headers.authorization) {
    return runSecurityHeader(req, allowedRoles)
  } else {
    return runSecurityCookie(req, allowedRoles)
  }
}
