module.exports = {
  'env': {
    'es2022': true,
    'node': true
  },
  'extends': 'standard-with-typescript',
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}',
        'config.{js,cjs}',
        'newrelic.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {}
}
