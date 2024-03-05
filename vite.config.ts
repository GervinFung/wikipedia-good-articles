import { defineConfig } from 'vite';

import { svelte } from '@sveltejs/vite-plugin-svelte';

import preprocess from 'svelte-preprocess';

export default defineConfig(() => {
	const server = {
		port: 4000,
		open: false,
		strictPort: true,
	} as const;

	const root = process.cwd();

	return {
		plugins: [
			svelte({
				preprocess: preprocess(),
			}),
		],
		clearScreen: false,
		root: `${root}/src`,
		publicDir: `${root}/public`,
		server,
		preview: server,
		build: {
			emptyOutDir: true,
			outDir: `${root}/build`,
		},
	};
});
