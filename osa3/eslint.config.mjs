import js from '@eslint/js'

export default [
  // 1️⃣ Ignore frontend build
  {
    ignores: ['dist/**'],
  },

  // 2️⃣ Backend (Node.js)
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
]
