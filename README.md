# cf-security

Check security header in Cloud Functions

```
X_NITRA_CF_KEY: secret
```

```
const { cfSecurity } = require('@nitra/cf-security')

exports.function = async (req, res) => {
  if (!cfSecurity(req)) {
    res.send(`Nitra security not passed`)
    return
  }
```
