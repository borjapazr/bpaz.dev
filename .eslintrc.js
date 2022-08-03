/*
 * simple-import-sort default grouping, but with type imports last as a separate
 * group, sorting that group like non-type imports are grouped.
 */
const importGroups = [
  // React import always first
  ['^react', '^@types/react'],
  // Side effect imports.
  ['^\\u0000'],
  // Packages.
  // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
  ['^@?\\w'],
  // Absolute imports and other imports such as Vue-style `@/foo`.
  // Anything not matched in another group.
  ['^'],
  // Relative imports.
  // Anything that starts with a dot
  ['^\\.'],
  // Typings
  ['^@?\\w.*\\u0000$', '^[^.].*\\u0000$', '^\\..*\\u0000$']
];

/*
 * Configuration for simple-import-sort plugin to detect
 * the different namespaces defined in the application.
 * This matches the "paths" property of the tsconfig.json file.
 */
const { compilerOptions } = require('get-tsconfig').getTsconfig('./tsconfig.json')['config'];
if ('paths' in compilerOptions) {
  const namespaces = Object.keys(compilerOptions.paths).map(path => path.replace('/*', ''));
  if (namespaces && namespaces.length > 0) {
    // Anything that is defined in tsconfig.json with a little trick in order to resolve paths
    const pathAliasRegex = [`^(${namespaces.join('|')})(/.*|$)`];
    importGroups.splice(3, 0, pathAliasRegex);
  }
}

module.exports = {
  root: true,
  // Configuration for all files
  extends: ['next/core-web-vitals'],
  plugins: [],
  rules: {},
  overrides: [
    // Configuration for JavaScript files
    {
      files: ['**/*.js', '**/*.jsx'],
      extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:prettier/recommended'],
      plugins: ['prettier'],
      rules: {}
    },
    // Configuration for TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true
      },
      extends: [
        'next/core-web-vitals',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@next/next/recommended',
        'plugin:tailwindcss/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended'
      ],
      plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        '@next/next',
        'tailwindcss',
        'unused-imports',
        'simple-import-sort',
        'prefer-arrow',
        'import',
        'deprecation',
        'prettier'
      ],
      settings: {
        // Define import resolver for import plugin
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true
          }
        }
      },
      rules: {
        // For faster development
        'no-process-exit': 'off',
        'no-useless-constructor': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',

        // Import and order style
        'simple-import-sort/imports': [
          'error',
          {
            groups: importGroups
          }
        ],
        'no-restricted-imports': [
          'warn',
          {
            patterns: [
              {
                group: ['../*', './../*'],
                message: 'For imports of parent elements use better path aliases. For example, @domain/shared.'
              }
            ]
          }
        ],
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'simple-import-sort/exports': 'error',
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'off',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-deprecated': 'error',
        'import/group-exports': 'error',
        'import/exports-last': 'error',
        'padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: '*', next: 'export' },
          { blankLine: 'any', prev: 'export', next: 'export' }
        ],
        quotes: [
          'error',
          'single',
          {
            allowTemplateLiterals: true
          }
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
        ],

        // General rules
        'deprecation/deprecation': 'warn',
        'lines-between-class-members': 'off',
        '@typescript-eslint/lines-between-class-members': 'error',
        'prefer-arrow/prefer-arrow-functions': [
          'warn',
          {
            disallowPrototype: true,
            singleReturnOnly: false,
            classPropertiesAllowed: false
          }
        ]
      },
      overrides: [
        {
          files: ['**/*.test.ts', '**/*.test.tsx'],
          env: {
            jest: true,
            'jest/globals': true
          },
          extends: [
            'plugin:jest/recommended',
            'plugin:jest/style',
            'plugin:jest-formatting/recommended',
            'plugin:testing-library/react',
            'plugin:jest-dom/recommended'
          ],
          plugins: ['jest', 'jest-formatting', 'testing-library', 'jest-dom'],
          rules: {
            'jest/expect-expect': ['error', { assertFunctionNames: ['expect', 'request.**.expect'] }]
          }
        },
        {
          files: ['*.e2e.ts', '*.cy.ts'],
          env: {
            'cypress/globals': true
          },
          parserOptions: {
            project: './cypress/tsconfig.json'
          },
          extends: ['plugin:cypress/recommended'],
          plugins: ['cypress'],
          rules: {}
        }
      ]
    }
  ]
};
