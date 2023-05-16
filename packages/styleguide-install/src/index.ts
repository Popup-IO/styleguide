#!/usr/bin/env node

import fs from "fs-extra";
import { z } from "zod";
import inquirer from "inquirer";
import configPackageJson from "../../styleguide-config/package.json";

const packageJson: unknown = await fs.readJSON("package.json").catch(() => {
	console.error(
		"Could not read or find a package.json file in this directory. Are you sure you are inside the repository you want to add linting to?"
	);
	process.exit(1);
});

const pkgJsonSchema = z
	.object({
		scripts: z
			.object({
				lint: z.string(),
			})
			.partial()
			.passthrough(),
		devDependencies: z
			.object({
				"@popup-io/styleguide-config": z.string(),
			})
			.partial()
			.passthrough(),
	})
	.partial()
	.passthrough();

const newPackageJson = pkgJsonSchema.parse(packageJson);
let packageJsonChanged = false;

if (
	newPackageJson.scripts?.lint &&
	newPackageJson.scripts.lint !== "styleguide-lint"
) {
	const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
		type: "confirm",
		name: "confirm",
		message: `Your 'lint' script is currently '${newPackageJson.scripts.lint}'. Do you want to overwrite this?`,
	});

	if (confirm) {
		newPackageJson.scripts ??= {};
		newPackageJson.scripts.lint = "styleguide-lint";
		packageJsonChanged = true;
	}
}

let versionChanged = false;

if (
	newPackageJson.devDependencies?.["@popup-io/styleguide-config"] !==
	configPackageJson.version
) {
	newPackageJson.devDependencies ??= {};
	newPackageJson.devDependencies["@popup-io/styleguide-config"] =
		configPackageJson.version;
	packageJsonChanged = true;
	versionChanged = true;
}

if (packageJsonChanged) {
	await fs.writeJson("package.json", newPackageJson);
	console.log("Changed package.json.");
}

if (versionChanged) {
	console.log(
		'You want to run "npm install", "yarn install" (or the alternative for your package manager) to get the latest config version.'
	);
}
