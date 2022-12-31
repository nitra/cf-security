import verify from '@nitra/jwt/verify'
import { isDev } from '@nitra/isenv'

/**
 * Check request for Nitra security з токеном в кукі
 *
 * @param {object} req - Fastify  Request for check
 * @return {string} token if check passed
 */
export default async (req, allowedRoles) => {
  // Читаємо кукі
  const c = Object.fromEntries(req.raw.headers.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)))

  // Для дева можна й не передавати токен
  if (isDev) {
    // Але якщо передали - то беремо контент з нього
    if (c['jwt-auth']) {
      // ігноруючи expired
      const token = await verify(c['jwt-auth'], { ignoreExpiration: true })
      return token.body
    } else {
      return { name: 'dev', 'https://hasura.io/jwt/claims': { 'x-hasura-allowed-roles': allowedRoles } }
    }
  }

  // Перевіряємо токен тільки
  if (!c['jwt-auth']) {
    throw new Error('[verification] no authorization header')
  }

  const token = await verify(c['jwt-auth'])

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
