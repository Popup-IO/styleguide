import eslintJs from "@eslint/js";
import tsEslint from "@typescript-eslint/eslint-plugin";
import * as tsEslintParser from "@typescript-eslint/parser";
import type { ESLint, Linter } from "eslint";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import { readFileSync } from "fs";
import * as globals from "globals";

const ignoreFile = readFileSync(".gitignore", "utf8");
const ignores = ignoreFile
	.split("\n")
	.filter((line) => line !== "" && !line.startsWith("#"))
	.flatMap((line) =>
		// If the line contains a /, it is always only valid from the root. In that
		// case, emove the leading slash, because eslint doesn't support it.
		// Otherwise, also add **/ at the beginning and end to make it work from
		// everywhere.
		line.includes("/") ? line.replace(/^\//, "") : [line, "**/" + line + "/**"],
	);

const config: Linter.FlatConfig[] = [
	// These are all the files that we want to format.
	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
	},

	// Don't lint files that are covered by the .gitignore file.
	{
		ignores,
	},

	// Add all recommended rules from eslint.
	eslintJs.configs.recommended,

	// The @typescript-eslint plugin is not yet optimized for the new ESLint configuration format.
	// This is the same as the 'base' config, but for the new format.
	{
		plugins: {
			"@typescript-eslint": tsEslint as ESLint.Plugin,
		},
		languageOptions: {
			parser: tsEslintParser,
			parserOptions: {
				sourceType: "module",
				// Enable searching for the typescript project to make all rules work.
				project: true,
			},
		},
	},

	// The @typescript-eslint/eslint-recommended only contains one override. In the new eslint
	// config format, everything is always an override, so we can just use the contents.
	{
		rules: tsEslint.configs["eslint-recommended"]?.overrides?.[0]
			?.rules as Linter.RulesRecord,
	},

	// From the rulesets we want to use, we only need the 'rules' part (the 'extends' are
	// already imported manually above).
	{
		rules: tsEslint.configs["recommended-type-checked"]
			?.rules as Linter.RulesRecord,
	},
	{
		rules: tsEslint.configs["strict-type-checked"]?.rules as Linter.RulesRecord,
	},
	{
		rules: tsEslint.configs["stylistic-type-checked"]
			?.rules as Linter.RulesRecord,
	},

	// Add the react-hooks plugin and recommended rules.
	{
		plugins: { "react-hooks": reactHooks },
	},
	{
		rules: reactHooks.configs?.["recommended"]?.rules as Linter.RulesRecord,
	},

	// Add the react plugin and recommended rules.
	{
		settings: {
			react: {
				// This will be the default in a future version and makes life easier.
				version: "detect",
			},
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	reactRecommended,
	reactJsxRuntime,

	// Add prettier formatting.
	// It is added last, so it can override all other rules.
	{
		plugins: { prettier },
		rules: {
			...prettierConfig.rules,
			...(prettier.configs?.["recommended"]?.rules as Linter.RulesRecord),
		},
	},
];

export default config;
