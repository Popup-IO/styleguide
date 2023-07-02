#!/usr/bin/env node

import { $ } from "execa";
import { argv } from "process";

const fix = argv.includes("--fix");

const $$ = $({ reject: false, stdio: "inherit" });

const eslint = fix ? await $$`eslint . --fix` : await $$`eslint .`;

const pretierFlag = fix ? "--write" : "--check";
const prettier =
	await $$`prettier ${pretierFlag} . ${"!**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"}`;

if (prettier.failed || eslint.failed) {
	process.exit(1);
}
