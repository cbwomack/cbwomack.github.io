/** Split an author list so "Womack, C." or "Womack, C. B." can be set in bold without {@html}. */
export function splitAuthors(authors: string): { text: string; bold: boolean }[] {
	const parts: { text: string; bold: boolean }[] = [];
	let last = 0;
	for (const match of authors.matchAll(/Womack,\s*C\.(?:\s*B\.)?/g)) {
		if (match.index > last) parts.push({ text: authors.slice(last, match.index), bold: false });
		parts.push({ text: match[0], bold: true });
		last = match.index + match[0].length;
	}
	if (last < authors.length) parts.push({ text: authors.slice(last), bold: false });
	return parts;
}
