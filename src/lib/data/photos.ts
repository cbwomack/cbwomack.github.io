/**
 * Chris's photos shown on the About page: one, chosen at random on each visit, takes the portrait's
 * place as the reader scrolls down to Interests (static/about.js). Files live in static/photos/ as
 * <name>-1600.jpg and <name>-800.jpg, with no camera or location data.
 *
 * Only photos with the portrait's 3:2 shape are listed, so the swap never crops or stretches.
 * Alt text describes what is visible.
 */
export interface Photo {
	name: string;
	alt: string;
}

export const aboutPhotos: Photo[] = [
	{ name: 'patagonia-615', alt: 'Three granite towers in low cloud above a boulder field' },
	{ name: 'patagonia-439', alt: 'A pale granite massif with a dark cap above a grassy slope' },
	{ name: 'patagonia-166', alt: 'A horse grazing in a meadow below snowy peaks' },
	{ name: 'patagonia-328', alt: 'A crevassed glacier seen through bare branches' },
	{ name: 'patagonia-351', alt: 'A bird of prey gliding under a blue sky with clouds' },
	{ name: 'patagonia-450', alt: 'A grey fox looking at the camera among shrubs' },
	{ name: 'patagonia-618', alt: 'Flamingos wading in a shallow, rippled lake' },
	{ name: 'patagonia-822', alt: 'Three penguins standing on bare ground' },
	{ name: 'patagonia-824', alt: 'A penguin chick at the mouth of its burrow' },
	{ name: 'patagonia-959', alt: 'An orca surfacing in a grey sea' },
	{ name: 'denali-003', alt: 'A brown dog with its eyes half closed in the sun' },
	{ name: 'denali-075', alt: 'A bear far off on a green tundra slope below red-brown hills' },
	{ name: 'denali-123', alt: 'A ptarmigan with white wings among bare shrubs' },
	{
		name: 'denali-196',
		alt: 'Three caribou walking across a tundra slope, snowy mountains behind'
	},
	{ name: 'denali-322', alt: 'A white mountain sheep on a rock below dark, snow-streaked peaks' },
	{ name: 'denali-433', alt: 'Snow-streaked mountain ranges in haze' },
	{ name: 'denali-645', alt: 'A ground squirrel standing upright beside lichen-covered rocks' },
	{ name: 'denali-773', alt: 'A blue and yellow passenger train in a forested valley' },
	{ name: 'prints-1', alt: 'A tall waterfall between moss-covered cliffs' },
	{ name: 'prints-2', alt: 'A green, flat-topped mountain above a black sand plain' },
	{ name: 'prints-5', alt: 'A puffin with its wings spread in long grass' },
	{ name: 'prints-6', alt: 'A dark sea stack with an arch, under heavy cloud' }
];
