// Text about Chris used across the site.

export const site = {
	name: 'Chris Womack',
	email: 'cwomack@ethz.ch',
	/** The hero title, one entry per line. */
	headline: ['Making sense of', 'a changing climate.'],
	/** First line: the role and group (CV). Second line: the institute. */
	role: [
		'Postdoctoral Researcher, Land-Climate Dynamics Group',
		'ETH Zürich, Institute for Atmospheric and Climate Science'
	],
	bio: 'I build faster, physics-grounded emulators of the Earth system to help understand what a changing climate means for people and ecosystems.',
	/** The About page's longer bio, one entry per paragraph. */
	aboutBio: [
		"Hi there! I'm Chris, and I research climate and AI at ETH Zürich. I received my PhD at MIT where I studied numerical methods for climate emulation, developed new ML approaches to synthetic training data generation, and applied these techniques to study future climate impacts. To me, the most interesting research questions are those that are both hugely interdisciplinary in scope and human-facing.",
		"I'm interested in where machine learning, policy, and sustainability meet, and in how that overlap can help address climate change. In my free time I love movies, Formula 1, puzzles, and hiking/backpacking!"
	],
	interests: [
		'Climate emulation',
		'Physics-informed machine learning',
		'MultiSector Dynamics',
		'Computational science and numerical methods',
		'Science communication and advocacy'
	]
} as const;

export interface ContactLink {
	label: string;
	href: string;
}

/** The profile and contact links, shown as icons in every page footer. */
export const contactLinks: ContactLink[] = [
	{ label: 'Email', href: `mailto:${site.email}` },
	{ label: 'CV (PDF)', href: '/cv.pdf' },
	{ label: 'GitHub', href: 'https://github.com/cbwomack/' },
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/christopher-womack-xvi/'
	},
	{
		label: 'Google Scholar',
		href: 'https://scholar.google.com/citations?user=-iK-NAcAAAAJ&hl=en'
	}
];
