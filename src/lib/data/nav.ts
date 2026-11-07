import { site } from './site';

export interface NavLink {
	label: string;
	href: string;
}

/**
 * The site's four destinations, in the header on every page (the footer lists the pages in the same
 * order). "Contact" opens an email to Chris.
 * The CV link must never get rel="external": the prerender crawl then checks that /cv.pdf exists.
 */
export const navLinks: NavLink[] = [
	{ label: 'About', href: '/about' },
	{ label: 'Publications', href: '/publications' },
	{ label: 'CV', href: '/cv.pdf' },
	{ label: 'Contact', href: `mailto:${site.email}` }
];
