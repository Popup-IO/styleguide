# The definitive TypeScript styleguide

This styleguide combines the best of all worlds.

## Install

Run `npx @popup-io/styleguide-install` in the root of your application.

## The styleguide

This is not a completely new styleguide. Instead, it combines already existing presets.

- Prettier
  - All the default options, except:
  - Tabs-based indentation for better accessibility (indent size is 2)
- ESLint
  - All recomended [rules](https://eslint.org/docs/latest/rules/)
- ESLint React Rules of Hooks
  - [Both rules](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- ESLint React
  - All [recommended rules](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/configs/recommended.js) [for the latest JSX runtime](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/configs/jsx-runtime.js)
- TypeScript
  - The [strictest](https://github.com/tsconfig/bases/blob/main/bases/strictest.json) config
  - The [recommended](https://github.com/tsconfig/bases/blob/main/bases/recommended.json) config
  - The [next](https://github.com/tsconfig/bases/blob/main/bases/next.json) config
- TypeScript ESLint
  - All recommended-type-checked rules
  - All strict-type-checked rules
  - All stylistic-type-checked rules
- [Prettier Plugin: Organize Imports](https://www.npmjs.com/package/prettier-plugin-organize-imports)

## Adjusting the styleguide

You think you know better? Sure, we all do.

- Change from x to x

## Rationale

The most famous styleguides are from [airbnb](https://github.com/airbnb/javascript) and [standard](https://standardjs.com), which both are ESLint based. These are not optimized for TypeScript.

## Interesting reads

- [Discussion if prettier should use tabs by default](https://github.com/prettier/prettier/issues/7475)
- [Discussion on rulesets in typescript-eslint v6](https://github.com/typescript-eslint/typescript-eslint/discussions/6014)
- [TypeScript ESLint v6 docs](https://v6--typescript-eslint.netlify.app/getting-started)
