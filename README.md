# cf-security

[![GitHub Super-Linter](https://github.com/nitra/cf-security/workflows/npm-publish/badge.svg)](https://github.com/marketplace/actions/super-linter)

Check security header in Cloud Functions

```HTTP
X_NITRA_CF_KEY: secret
```

```JavaScript
const { cfSecurity } = require('@nitra/cf-security')

exports.function = async (req, res) => {
  if (!cfSecurity(req)) {
    res.send(`Nitra security not passed`)
    return
  }
```

```HTTP
ALLOWED_ROLES: role1,role2
```

```JavaScript
import runSecurity from '@nitra/cf-security'

exports.function = async (req, res) => {
  if (!runSecurity(req)) {
    res.send(`Nitra security not passed`)
    return
  }
```
