import { cfSecurity } from '../src/index.js'
import { equal } from 'assert'
import TestDirector from 'test-director'

const tests = new TestDirector()

tests.add('success', () => {
  const re = cfSecurity({})

  equal(re, false)
})

tests.run()
