import getLogger from '@nitra/bunyan/trace'
import checkEnv from '@nitra/check-env'
import verify from '@nitra/jwt/verify'
import { isDev } from '@nitra/isenv'

checkEnv(['ALLOWED_ROLES'])

/**
 * Check request for Nitra security rules WI
 *
 * @param {object} req - Fastify  Request for check
 * @return {string} token if check passed
 */
export default async req => {
  if (isDev) {
    const token = {}
    token['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'] = process.env.ALLOWED_ROLES.split(',')
    return token
  }

  const log = getLogger(req)

  // Перевіряємо токен тільки
  if (!req.headers?.authorization) {
    log.info('[verification] no authorization data')
    return false
  }

  const authHeaders = req.headers.authorization.split(' ')
  const token = await verify(authHeaders[1])

  if (!token) {
    log.info('[verification] invalid token')
    return false
  }

  const roleArray = token.body['https://hasura.io/jwt/claims']['x-hasura-allowed-roles']

  const allowedRoles = process.env.ALLOWED_ROLES.split(',')

  const intersectRoles = intersection(roleArray, allowedRoles)

  if (intersectRoles.length === 0) {
    log.info('[verification] invalid all roles')
    return false
  }

  return token.body
}

function intersection(a, b) {
  const setA = new Set(a)
  return b.filter(value => setA.has(value))
}
