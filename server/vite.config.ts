import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// The public URL the app is served from, e.g. https://launchpad.example.com.
	// Needed behind a reverse proxy, where the app can't tell its own origin.
	const { ORIGIN } = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				// Consult https://svelte.dev/docs/kit/integrations
				// for more information about preprocessors
				preprocess: vitePreprocess(),
				adapter: adapter(),
				paths: { origin: ORIGIN || undefined }
			})
		],
		preview: {
			allowedHosts: ORIGIN ? [new URL(ORIGIN).hostname] : []
		}
	};
});
