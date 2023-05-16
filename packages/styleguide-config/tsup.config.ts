import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/eslint-config.ts"],
	format: ["cjs", "esm"],
	dts: true,
	//splitting: false,
	sourcemap: true,
	clean: true,
});
