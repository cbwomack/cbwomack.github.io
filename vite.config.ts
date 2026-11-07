import { enhancedImages } from '@sveltejs/enhanced-img';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// The whole site is prerendered to plain HTML/CSS/JS for GitHub Pages (a user site,
			// served at the domain root, so no base path is needed).
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: undefined,
				precompress: false,
				strict: true
			}),

			// Root-absolute asset paths, so build/404.html still finds its CSS when GitHub Pages serves
			// it at a nested URL such as /a/b.
			paths: { relative: false },

			prerender: {
				// The crawl starts at Home and follows every link, so a broken internal link or a
				// missing static file (such as /cv.pdf) fails the build. Links marked rel="external"
				// are skipped by the crawl, so internal files must never carry it.
				// /404 is linked from nowhere, so it is listed here; it becomes build/404.html, which
				// GitHub Pages serves for unknown paths.
				entries: ['/', '/404'],
				// The live address: page.url.origin in SeoHead, and the crawl checks these URLs too.
				origin: 'https://cbwomack.github.io'
			}
		})
	]
});
