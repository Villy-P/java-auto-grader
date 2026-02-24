import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { monaco } from '@bithero/monaco-editor-vite-plugin';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), monaco({
		features: "all",
		languages: ["java"],
		globalAPI: true
	})]
});
