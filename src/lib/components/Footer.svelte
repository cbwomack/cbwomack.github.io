<!--
	Every page ends here: a tint field with the pages, the CV, and icon links for email and the
	profiles.
-->
<script lang="ts">
	import { contactLinks, site } from '$lib/data/site';
	import { navLinks } from '$lib/data/nav';

	// Pages first (CV as text), then the icons.
	const pages = navLinks.filter((l) => l.href.startsWith('/') && !l.href.endsWith('.pdf'));

	// 24 x 24 glyphs. Hrefs come from site.ts, so there is one source.
	const ICONS: Record<string, string> = {
		Email:
			'M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67ZM22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z',
		'Google Scholar':
			'M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z',
		GitHub:
			'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
		LinkedIn:
			'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
	};
	const iconOrder = ['Email', 'Google Scholar', 'GitHub', 'LinkedIn'];
	const icons = iconOrder.map((label) => {
		const link = contactLinks.find((l) => l.label === label);
		if (!link) throw new Error(`No contact link labelled ${label} in site.ts`);
		return { label, href: link.href, path: ICONS[label] };
	});
</script>

<footer class="foot">
	<div class="who">
		<p class="name">{site.name}</p>
		<p class="muted">{site.role[1]}</p>
	</div>
	<nav aria-label="Footer">
		<ul class="pages">
			<li><a href="/">Home</a></li>
			{#each pages as link (link.href)}
				<li><a href={link.href}>{link.label}</a></li>
			{/each}
			<li><a href="/cv.pdf">CV (PDF)</a></li>
		</ul>
		<ul class="icons">
			{#each icons as icon (icon.label)}
				<li>
					<a href={icon.href} aria-label={icon.label} title={icon.label}>
						<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
							<path d={icon.path} />
						</svg>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</footer>

<style>
	.foot {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 24px 48px;
		padding: 40px var(--gutter) 48px;
		background: var(--tint);
		font-size: 18px;
		line-height: 1.5;
	}

	.name {
		font-weight: 600;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 16px 40px;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 28px;
	}

	.icons {
		gap: 8px 20px;
	}

	/* Icons in the link colour (5.8:1 on the tint); targets well over 24 px. */
	.icons a {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
	}

	@media (max-width: 760px) {
		.foot {
			grid-template-columns: minmax(0, 1fr);
		}

		nav {
			justify-content: flex-start;
		}

		.icons {
			margin-left: -8px;
		}
	}
</style>
