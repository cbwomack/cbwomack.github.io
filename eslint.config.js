import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default defineConfig(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{
		// The site is a GitHub user site served at the domain root, with no client-side router
		// (csr = false), so plain root-absolute hrefs are correct. If it ever moves under a sub-path
		// (a project site), set kit paths.base and turn this rule back on.
		rules: { 'svelte/no-navigation-without-resolve': 'off' }
	},
	globalIgnores(['build/', '.svelte-kit/', 'dist/', 'node_modules/', 'static/disc/'])
);
