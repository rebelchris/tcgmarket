import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'airbnb',
    'airbnb/hooks',
    'next/core-web-vitals',
    'next/typescript',
    'prettier',
  ),
  {
    rules: {
      // Allow extensionless imports for js, jsx, ts, tsx
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      // Disable rule that disallows JSX in .tsx files (Next.js convention)
      'react/jsx-filename-extension': 'off',
      // Enforce trailing commas where valiw in ES5 (objects, arrays, etc.)
      'comma-dangle': ['error', 'always-multiline'],
      // Enforce consistent 2-space indentation
      indent: ['error', 2],
      // Allow __dirname and __filename
      'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
      // Allow lines up to 120 characters, warn if exceeded
      'max-len': [
        'warn',
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      // Disable one-expression-per-line rule for JSX
      'react/jsx-one-expression-per-line': 'off',
    },
  },
];
export default eslintConfig;
