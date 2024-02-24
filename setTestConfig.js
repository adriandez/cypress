const argv = require('minimist')(process.argv.slice(2))

if (argv.browser) {
  process.env.TEST_BROWSER = argv.browser
}

console.log(
  `Running tests with TEST_ENV=${process.env.TEST_ENV} and TEST_BROWSER=${process.env.TEST_BROWSER || 'electron'}`
)
