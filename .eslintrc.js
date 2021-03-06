module.exports = {
   root: true,
   env: {
      browser: true,
      node: true,
   },
   extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      'plugin:prettier/recommended',
   ],
   parserOptions: {
      parser: '@babel/eslint-parser',
   },
   ignorePatterns: ['node_modules'],
   rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
   },
}
