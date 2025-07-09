import verify from '@nitra/jwt/verify'
import { isDev } from '@nitra/isenv'
import { intersection } from './utils/intersection.js'

/**
 * Check request for Nitra security rules WI
 * @param {object} req - Fastify  Request for check
 * @param {Array} allowedRoles - Allowed roles
 * @returns {Promise<string>} token if check passed
 */
export default async (req, allowedRoles) => {
  const { parsed } = await runSecurityHeader(req, allowedRoles)
  return parsed
}

/**
 * Check request for Nitra security rules WI
 * @param {object} req - Fastify  Request for check
 * @param {Array} allowedRoles - Allowed roles
 * @returns {Promise<object>} token if check passed
 */
export const runSecurityHeader = async (req, allowedRoles) => {
  // Для дева можна й не передавати токен
  if (isDev) {
    // Але якщо передали - то беремо контент з нього
    if (req.headers?.authorization) {
      // ігноруючи expired
      const token = await verify(req.headers.authorization.split(' ')[1], { ignoreExpiration: true })

      const intersectRoles = intersection(
        token.body['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'],
        allowedRoles
      )

      if (intersectRoles.length === 0) {
        throw new Error(`[verification] unallowed roles ${allowedRoles}`)
      }

      const authHeaders = req.headers.authorization.split(' ')
      return { raw: authHeaders[1], parsed: token.body }
    }
    return {
      raw: 0,
      parsed: { name: 'dev', 'https://hasura.io/jwt/claims': { 'x-hasura-allowed-roles': allowedRoles } }
    }
  }

  // Перевіряємо токен тільки
  if (!req.headers?.authorization) {
    throw new Error('[verification] no authorization header')
  }

  const authHeaders = req.headers.authorization.split(' ')
  const token = await verify(authHeaders[1])

  if (!token) {
    throw new Error('[verification] invalid token')
  }

  const roleArray = token.body['https://hasura.io/jwt/claims']['x-hasura-allowed-roles']
  const intersectRoles = intersection(roleArray, allowedRoles)

  if (intersectRoles.length === 0) {
    throw new Error(`[verification] unallowed roles ${roleArray}`)
  }

  return { raw: authHeaders[1], parsed: token.body }
}
