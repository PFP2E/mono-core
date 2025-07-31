import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import' // Need to import this for the plugin object
import nextPlugin from '@next/eslint-plugin-next' // Import the Next.js plugin
import eslintConfigPrettier from 'eslint-config-prettier' // Import this to ensure prettier rules are applied last

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Recommended: Specify resolver extensions explicitly for FlatCompat
  resolvePluginsRelativeTo: __dirname
})

const eslintConfig = [
  {
    ignores: [
      '.next/',
      '.DS_Store',
      'node_modules/',
      'build/',
      'dist/',
      'out/',
      'public/sw.js', // Example if using next-pwa later
      '**/node_modules/*',
      '**/test-results/*'
    ]
  }, // Added common ignores
  // Extends Next.js recommended ESLint configurations, including Core Web Vitals rules.
  // Use compat.extends for configurations that might not be flat config ready yet
  ...compat.extends(
    'next/core-web-vitals'
    // 'plugin:import/recommended', // Consider adding if needed, TS handles many cases
    // 'plugin:import/typescript' // Consider adding if needed
  ),
  // Manually configure plugins and rules for flat config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      import: importPlugin, // Add import plugin here
      prettier: prettierPlugin
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json', // Ensure this path is correct
        ecmaVersion: 'latest', // Use 'latest'
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
        // tsconfigRootDir: __dirname // Usually not needed if project path is relative
      },
      globals: {
        // Add common globals
        React: 'readonly',
        JSX: 'readonly',
        NodeJS: 'readonly',
        Bun: 'readonly'
      }
    },
    settings: {
      // Add settings for react and import resolver
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: true,
        node: true
      }
    },
    rules: {
      // Apply recommended rules from plugins
      ...typescriptPlugin.configs['recommended'].rules,
      ...reactPlugin.configs['recommended'].rules,
      ...jsxA11yPlugin.configs['recommended'].rules,
      ...prettierPlugin.configs['recommended'].rules, // Use recommended prettier rules
      ...eslintConfigPrettier.rules, // Apply eslint-config-prettier to disable conflicting rules

      // Your custom rules
      'no-unused-vars': 'off', // Disable base rule
      '@typescript-eslint/no-unused-vars': [
        // Enable TS version
        'warn', // Use 'warn' during development?
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }], // Allow backticks
      'react/prop-types': 'off', // Not needed with TypeScript
      'jsx-quotes': ['error', 'prefer-single'],
      'arrow-parens': ['error', 'as-needed'], // Changed to 'as-needed' to match prettier default more closely
      'eol-last': ['error', 'always'],
      'no-duplicate-imports': 'off', // Let eslint-plugin-import handle this
      'import/no-duplicates': 'warn',
      'react/react-in-jsx-scope': 'off', // Not needed with Next.js >= 11
      'import/named': 'off', // Can be problematic with TS/auto-imports
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Relax rule for inferred types
      '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of error for 'any'
      '@next/next/no-html-link-for-pages': 'off' // Allow standard <a> tags if needed, adjust as necessary
    }
  }
  // Specific overrides if needed, e.g., for config files
  // {
  //   files: ['**/*.config.js', '**/*.config.mjs'],
  //   languageOptions: {
  //     globals: {
  //       process: 'readonly',
  //       module: 'readonly',
  //       require: 'readonly',
  //       __dirname: 'readonly',
  //     }
  //   }
  // }
]

export default eslintConfig
