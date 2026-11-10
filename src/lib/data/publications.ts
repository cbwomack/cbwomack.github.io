export type PublicationCategory = 'publication' | 'talk' | 'preprint';

export interface Publication {
	title: string;
	authors: string;
	/** Journal, thesis department, or conference/session the work appeared in. */
	venue: string;
	year: number;
	/** Empty when the work has no public page yet. */
	link: string;
	/**
	 * A short summary (about two sentences, roughly as tall as the title, authors and venue on the
	 * Publications card), not the full abstract. Empty when none is available; the page then shows none.
	 */
	abstract: string;
	category: PublicationCategory;
}

// Hand-maintained publication list, sourced from Google Scholar. Add new
// entries here as they're published; the /publications page groups by
// category and sorts each group by year (descending) automatically.
export const publications: Publication[] = [
	// --- Publications (peer-reviewed articles and theses) ---
	{
		title: 'Optimal scenario design for climate emulation',
		authors:
			'Womack, C. B., Bouabid, S., Sokolov, A., Salunke, P., Flierl, G., Eastham, S. D., & Selin, N. E.',
		venue: 'Proceedings of the National Academy of Sciences, 123 (46) e2620731123',
		year: 2026,
		link: 'https://www.pnas.org/doi/10.1073/pnas.2620731123',
		abstract:
			'Shows that training-data structure, not just model architecture, limits emulator predictive skill, and uses a differentiable climate model to iteratively design emission scenarios optimized for emulator training. An emulator trained on a single optimized scenario outperforms one trained on six standard ScenarioMIP pathways while using less data overall.',
		category: 'publication'
	},
	{
		title:
			'Evidence that end-of-century emulation errors under overshoot remain largely within internal variability in an Earth system model',
		authors: 'Bouabid, S., Womack, C. B., Selin, N. E., & Ferrari, R.',
		venue: 'Environmental Research Letters, 21, 164019',
		year: 2026,
		link: 'https://doi.org/10.1088/1748-9326/ae9c58',
		abstract:
			'Tests a global-temperature-driven emulator against an Earth system model ensemble under an aggressive overshoot scenario. End-of-century biases fall within internal variability for 99% of land regions; the rest track rapid aerosol cuts and shrink when aerosol optical depth is added as a predictor.',
		category: 'publication'
	},
	{
		title: 'A theoretical framework to understand sources of error in Earth System Model emulation',
		authors:
			'Womack, C. B., Flierl, G., Bouabid, S., Souza, A. N., Giani, P., Eastham, S. D., & Selin, N. E.',
		venue: 'Earth System Dynamics, 17(1), 107–139',
		year: 2026,
		link: 'https://doi.org/10.5194/esd-17-107-2026',
		abstract:
			'Presents a theoretical framework, built on Koopman and Fokker-Planck operators, that connects common climate emulation techniques and diagnoses their sources of error: memory effects, hidden variables, noise and nonlinearity. In box-model and Lorenz-63 tests, response-function emulators perform best across all scenarios.',
		category: 'publication'
	},
	{
		title:
			'Rapid Emulation of Spatially Resolved Temperature Response to Effective Radiative Forcing',
		authors: 'Womack, C. B., Giani, P., Eastham, S. D., & Selin, N. E.',
		venue: 'Journal of Advances in Modeling Earth Systems, 17(1), e2024MS004523',
		year: 2025,
		link: 'https://doi.org/10.1029/2024MS004523',
		abstract:
			'Represents the climate system through spatially resolved impulse response functions, derived by deconvolving effective radiative forcing and near-surface air temperature time series. New scenarios can then be emulated rapidly by convolution, without the scenario-specific limits of earlier impulse-response approaches.',
		category: 'publication'
	},
	{
		title: 'On the theory and optimal design of emulators for climate impact assessment',
		authors: 'Womack, C. B.',
		venue:
			'Ph.D. Thesis, Department of Aeronautics and Astronautics, Massachusetts Institute of Technology',
		year: 2026,
		link: '', // not yet in MIT DSpace
		abstract: '',
		category: 'publication'
	},
	{
		title:
			'Development and Stakeholder-informed Evaluation of Global Climate Temperature Response Functions',
		authors: 'Womack, C. B.',
		venue: 'S.M. Thesis, Technology and Policy Program, Massachusetts Institute of Technology',
		year: 2024,
		link: 'https://dspace.mit.edu/handle/1721.1/155065',
		abstract:
			'Develops a general framework for integrating stakeholder analysis into climate emulator development, applied to spatially resolved temperature response functions trained on CMIP6 experiments. Evaluates the resulting emulator against additional CMIP6 experiments, including the Shared Socioeconomic Pathways, and discusses how stakeholder-informed design increases emulator salience, credibility, and legitimacy for its intended audience.',
		category: 'publication'
	},
	{
		title: 'On the Potential Impact of Curved Meshing for Higher-order Adaptive Mesh Simulations',
		authors: 'Womack, C. B.',
		venue:
			'S.M. Thesis, Department of Aeronautics and Astronautics, Massachusetts Institute of Technology',
		year: 2024,
		link: 'https://dspace.mit.edu/handle/1721.1/153782',
		abstract:
			'Examines how incorporating curved, higher-order mesh elements into an adaptive finite element process affects accuracy and computational cost, relative to conventional straight-sided adaptive meshing, for simulations governed by partial differential equations.',
		category: 'publication'
	},

	// --- Contributed talks (conference presentations and abstracts) ---
	{
		title: 'Advances in generative climate emulation to support impact-assessment',
		authors:
			'Bouabid, S., Womack, C., Flierl, G., Selin, N., Ferrari, R., Souza, A., Giani, P., et al.',
		venue: 'EGU General Assembly 2026 (EGU26)',
		year: 2026,
		link: 'https://meetingorganizer.copernicus.org/EGU26/EGU26-10825.html',
		abstract:
			'Presents advances in probabilistic, generative climate emulation for impact assessment, including integrated bias-correction and a framework for designing emission scenarios optimized for emulator training.',
		category: 'talk'
	},
	{
		title: 'A review of spatially explicit climate emulators for enhancing modelling agility',
		authors: 'Schöngart, S., Gudmundsson, L., Womack, C. B., Schleussner, C.-F., et al.',
		venue: 'EGU General Assembly 2026 (EGU26)',
		year: 2026,
		link: 'https://doi.org/10.5194/egusphere-egu26-6394',
		abstract:
			'A review of spatially explicit climate emulation approaches and their role in enabling more agile climate impact modelling.',
		category: 'talk'
	},
	{
		title: 'Diagnosing and Comparing Sources of Error in Emulators of Earth System Models',
		authors:
			'Womack, C., Flierl, G., Bouabid, S., Souza, A., Giani, P., Eastham, S. D., & Selin, N. E.',
		venue: 'AGU Fall Meeting 2025, GC43F-0855',
		year: 2025,
		link: 'https://cs3.mit.edu/publication/118647',
		abstract:
			'Presents a framework to diagnose and compare sources of error across climate emulation techniques, finding that response-function-based emulators outperform other approaches, particularly pattern scaling, across the scenarios tested.',
		category: 'talk'
	},
	{
		title: 'Advancing Emulation for Understanding Nature-Society Interactions (Invited)',
		authors:
			'Selin, N. E., Ferrari, R., Bouabid, S., Chen, Y. H. H., Fiore, A. M., Flierl, G., Giani, P., et al.',
		venue: 'AGU Fall Meeting 2025, GC51A-01',
		year: 2025,
		link: 'https://cs3.mit.edu/publication/118644',
		abstract:
			'Invited talk on how emulators can incorporate additional Earth system components and their interactions with human activity into integrated analyses, with examples projecting temperature, precipitation, and air quality for decision-making.',
		category: 'talk'
	},
	{
		title: 'Accounting for Memory and Explainability in Emulating Dynamical Systems',
		authors: 'Womack, C., Flierl, G., Wang, R., Souza, A., Ferrari, R., & Selin, N. E.',
		venue: 'AGU Fall Meeting 2024, GC13V-07',
		year: 2024,
		link: 'https://scholar.google.com/citations?user=-iK-NAcAAAAJ&hl=en',
		abstract:
			'Discusses how memory effects and explainability considerations can be incorporated into emulators of dynamical systems.',
		category: 'talk'
	},
	{
		title:
			'Rapid Emulation of Spatially Resolved Temperature Response Functions to Effective Radiative Forcing',
		authors: 'Womack, C., Eckley Selin, N., & Eastham, S.',
		venue: 'EGU General Assembly 2024 (EGU24), Abstract 18412',
		year: 2024,
		link: 'https://meetingorganizer.copernicus.org/EGU24/EGU24-18412.html',
		abstract:
			'Conference presentation of a generalizable framework for emulating near-surface air temperature via spatially resolved impulse response functions, later expanded into the 2025 JAMES journal article.',
		category: 'talk'
	},

	// --- Preprints ---
	{
		title:
			'Assessing spatially explicit sensitivities to scenario uncertainty through climate emulation',
		authors:
			'Womack, C. B., Bouabid, S., Gao, X., Morris, J., Schlosser, C. A., Flierl, G., & Selin, N. E.',
		venue: 'Preprint, ESS Open Archive, doi:10.22541/essoar.15008111/v1',
		year: 2026,
		link: 'https://doi.org/10.22541/essoar.15008111/v1',
		abstract:
			"Couples MIT's EPPA emissions model with the MIT Earth Sampler, a generative diffusion-based climate emulator, to assess local sensitivity to emissions scenarios, including an early look at CMIP7. Internal variability masks regional differences between 1.5 °C and 2 °C scenarios, and overshoot brings higher cumulative heat stress than stabilization.",
		category: 'preprint'
	},
	{
		title: 'A review of spatially explicit climate emulators as agile tools for decision-support',
		authors:
			'Schöngart, S., Gudmundsson, L., Womack, C. B., Schleussner, C.-F., & Seneviratne, S. I.',
		venue: 'Preprint, Research Square, doi:10.21203/rs.3.rs-11205768/v1',
		year: 2026,
		link: 'https://doi.org/10.21203/rs.3.rs-11205768/v1',
		abstract:
			'Reviews 76 studies of spatially explicit weather and climate emulators, grouped by skill across timescales, inputs, outputs, methods and evaluation. Finds a siloed field, weak links between development and use, and concerns over computational equity, and calls for clearer task definitions and equitable access.',
		category: 'preprint'
	}
];

export function getLatestPublication(
	category: PublicationCategory = 'publication'
): Publication | undefined {
	return publications.filter((pub) => pub.category === category).sort((a, b) => b.year - a.year)[0];
}
