import { isDev } from '@nitra/isenv'
import verify from '@nitra/jwt/verify'
import { intersection } from './utils/intersection.js'

/**
 * Check request for Nitra security з токеном в кукі
 * @param {object} req - Fastify  Request for check
 * @param {Array<string>} allowedRoles - Allowed roles
 * @returns {Promise<object>} token if check passed
 */
export default async (req, allowedRoles) => {
  const { parsed } = await runSecurityCookie(req, allowedRoles)
  return parsed
}

/**
 * Check request for Nitra security rules WI
 * @param {object} req - Fastify  Request for check
 * @param {Array} allowedRoles - Allowed roles
 * @returns {Promise<object>} token if check passed
 */
export const runSecurityCookie = async (req, allowedRoles) => {
  if (!req.raw.headers?.cookie) {
    throw new Error('[verification] missing cookie')
  }

  // Читаємо кукі
  const c = Object.fromEntries(
    req.raw.headers.cookie.split('; ').map(v => v.split(/[=](.*)/s).map(x => decodeURIComponent(x)))
  )

  // Для дева можна й не передавати токен
  if (isDev) {
    // Але якщо передали - то беремо контент з нього
    if (c.__session) {
      // ігноруючи expired
      const token = await verify(c.__session, { ignoreExpiration: true })
      return { raw: c.__session, parsed: token.body }
    }
    return {
      raw: 0,
      parsed: { name: 'dev', 'https://hasura.io/jwt/claims': { 'x-hasura-allowed-roles': allowedRoles } }
    }
  }

  // Перевіряємо токен тільки
  if (!c.__session) {
    throw new Error('[verification] no authorization header')
  }

  const token = await verify(c.__session)

  if (!token) {
    throw new Error('[verification] invalid token')
  }

  const roleArray = token.body['https://hasura.io/jwt/claims']['x-hasura-allowed-roles']
  const intersectRoles = intersection(roleArray, allowedRoles)

  if (intersectRoles.length === 0) {
    throw new Error(`[verification] unallowed roles ${roleArray}`)
  }

  return { raw: c.__session, parsed: token.body }
}
