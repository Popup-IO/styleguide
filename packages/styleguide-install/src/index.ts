#!/usr/bin/env node

import fs from "fs-extra";
import { z } from "zod";
import inquirer from "inquirer";
import configPackageJson from "../../styleguide-config/package.json";
import eslintAndPrettierPackageJson from "../../eslint-and-prettier/package.json";

const packageJson: unknown = await fs.readJSON("package.json").catch(() => {
	console.error(
		"Could not read or find a package.json file in this directory. Are you sure you are inside the repository you want to add linting to?"
	);
	process.exit(1);
});

const pkgJsonSchema = z
	.object({
		private: z.boolean(),
		name: z.string(),
		version: z.string(),
		license: z.string(),
		type: z.string(),
		scripts: z.object({}).catchall(z.string()),
		dependencies: z.object({}).catchall(z.string()),
		devDependencies: z.object({}).catchall(z.string()),
	})
	.partial()
	.passthrough();

const newPackageJson = pkgJsonSchema.parse(packageJson);
let packageJsonChanged = false;

if (newPackageJson.type !== "module") {
	newPackageJson.type = "module";
	packageJsonChanged = true;
}

const scripts = {
	lint: "eslint-and-prettier",
	format: "eslint-and-prettier --fix",
};

for (const [script, command] of Object.entries(scripts)) {
	const oldCommand = newPackageJson.scripts?.[script];
	if (oldCommand === command) {
		continue;
	}

	const confirm =
		!oldCommand ||
		(await inquirer
			.prompt<{ confirm: boolean }>({
				type: "confirm",
				name: "confirm",
				message: `Your '${script}' script is currently '${oldCommand}'. Do you want to overwrite this to '${command}'?`,
			})
			.then((answers) => answers.confirm));

	if (!confirm) {
		continue;
	}

	newPackageJson.scripts ??= {};
	newPackageJson.scripts[script] = command;
	packageJsonChanged = true;
}

newPackageJson.devDependencies ??= {};
if (
	newPackageJson.devDependencies["@popup-io/styleguide-config"] !==
	configPackageJson.version
) {
	newPackageJson.devDependencies["@popup-io/styleguide-config"] =
		configPackageJson.version;
	packageJsonChanged = true;
}
if (
	newPackageJson.devDependencies["@popup-io/eslint-and-prettier"] !==
	eslintAndPrettierPackageJson.version
) {
	newPackageJson.devDependencies["@popup-io/eslint-and-prettier"] =
		eslintAndPrettierPackageJson.version;
	packageJsonChanged = true;
}

for (const dep of ["eslint", "eslint-config-next"]) {
	if (newPackageJson.dependencies?.[dep]) {
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete newPackageJson.dependencies[dep];
		packageJsonChanged = true;
	}
	if (newPackageJson.devDependencies[dep]) {
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete newPackageJson.devDependencies[dep];
		packageJsonChanged = true;
	}
}

if (packageJsonChanged) {
	const sortObject = <T extends Record<string, unknown>>(o: T): T =>
		Object.keys(o)
			.sort()
			// eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
			.reduce((r, k) => (((r as any)[k] = o[k]), r), {} as T);
	if (newPackageJson.dependencies)
		newPackageJson.dependencies = sortObject(newPackageJson.dependencies);
	newPackageJson.devDependencies = sortObject(newPackageJson.devDependencies);

	await fs.writeJson("package.json", newPackageJson, { spaces: "\t" });
	console.log("Changed package.json.");
	console.log(
		'You want to run "npm install", "yarn install" (or the alternative for your package manager) to get the latest config version.'
	);
} else {
	console.log("Your package.json is up to date.");
}

for (const file of [".eslintrc.json", ".eslintrc.js"]) {
	await fs.remove(file).catch(() => {
		//ignore
	});
}

await fs
	.copyFile(
		new URL("../assets/eslint.config.js", import.meta.url),
		"eslint.config.js"
	)
	.then(() => {
		console.log("Copied eslint.config.js.");
	})
	.catch((err) => {
		console.error("Could not copy eslint.config.js.");
		console.error(err);
	});

await fs
	.copyFile(
		new URL("../assets/.editorconfig", import.meta.url),
		".editorconfig"
	)
	.then(() => {
		console.log("Copied .editorconfig.");
	})
	.catch((err) => {
		console.error("Could not copy .editorconfig");
		console.error(err);
	});

await fs
	.ensureSymlink(".gitignore", ".prettierignore")
	.then(() => {
		console.log("Created symlink .prettierignore -> .gitignore.");
	})
	.catch((err) => {
		console.error("Could not create a symlink .prettierignore -> .gitignore.");
		console.error(err);
	});
