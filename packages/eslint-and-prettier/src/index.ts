#!/usr/bin/env node

import { $ } from "execa";

const $$ = $({ reject: false, stdio: "inherit" });

const eslint = await $$`eslint .`;
const prettier =
	await $$`prettier --check . ${"!**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"}`;

if (prettier.failed || eslint.failed) {
	process.exit(1);
}
