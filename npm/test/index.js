import cfSecurity from '../src/index.js'
import runSecurity from '../src/jwt-both.js'
import { equal } from 'assert'
import TestDirector from 'test-director'

const tests = new TestDirector()

tests.add('cf', () => {
  const re = cfSecurity({ headers: { 'x-nitra-cf-key': 'secret' } })

  equal(re, true)
})

tests.add('jwt', async () => {
  try {
    const re = await runSecurity(
      {
        headers: {
          authorization:
            'Bearer eyJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE2NDMzOTI4NDQsIm5iZiI6MTY0MzM5Mjg0NCwiZXhwIjoxNjQzNDc5MjQ0LCJpc3MiOiJhYmllIiwiaHR0cHM6XC9cL2hhc3VyYS5pb1wvand0XC9jbGFpbXMiOnsieC1oYXN1cmEtY2Fwcy1pZCI6IjQ0MDkiLCJ4LWhhc3VyYS1jYXBzLXVzZXJuYW1lIjoiYnVnYWlldmcifX0.v24fItY83zKB92T2XGq6Bb12kx_LfDchl'
        }
      },
      ['admin']
    )

    equal(re, false)
  } catch (e) {
    console.log(e)
  }
})

tests.run()
