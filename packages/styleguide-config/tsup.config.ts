import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/eslint-config.ts", "src/prettier-config.ts"],
	format: ["cjs", "esm"],
	dts: true,
	sourcemap: true,
	clean: true,
});
