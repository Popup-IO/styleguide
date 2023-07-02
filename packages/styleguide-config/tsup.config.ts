import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/eslint-config.ts"],
	format: ["cjs", "esm"],
	dts: true,
	sourcemap: true,
	clean: true,
});
