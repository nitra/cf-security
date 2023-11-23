import verify from '@nitra/jwt/verify'
import { isDev } from '@nitra/isenv'

/**
 * Check request for Nitra security rules WI
 *
 * @param {object} req - Fastify  Request for check
 * @param {Array} allowedRoles - Allowed roles
 * @return {Promise<string>} token if check passed
 */
export default async (req, allowedRoles) => {
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

      return token.body
    } else {
      return JSON.stringify({ name: 'dev', 'https://hasura.io/jwt/claims': { 'x-hasura-allowed-roles': allowedRoles } })
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

  return token.body
}

function intersection(a, b) {
  const setA = new Set(a)
  return b.filter(value => setA.has(value))
}
