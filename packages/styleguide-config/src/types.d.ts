declare module "@eslint/js" {
	import { Linter } from "eslint";
	const configs: {
		recommended: Linter.FlatConfig;
	};

	export { configs };
}

declare module "eslint-plugin-prettier" {
	import { ESLint } from "eslint";
	const plugin: ESLint.Plugin;
	export = plugin;
}

declare module "eslint-plugin-react" {
	import { ESLint } from "eslint";
	const plugin: ESLint.Plugin;
	export = plugin;
}

declare module "eslint-plugin-react/configs/*" {
	import { Linter } from "eslint";
	const config: Linter.FlatConfig;
	export = config;
}

declare module "@typescript-eslint/parser" {
	import { Linter } from "eslint";
	const parser: Linter.ParserModule;
	export = parser;
}
