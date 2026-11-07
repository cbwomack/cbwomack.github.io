<!--
	The Home monument at header size: WOMACK with a still image of the Disc as the O.
	Home has the live Disc; every other page uses this mark (static/disc/mark.png).
-->
<a class="mark" href="/" aria-label="Chris Womack, home">
	<span aria-hidden="true">W</span>
	<img src="/disc/mark.png" alt="" width="40" height="40" />
	<span aria-hidden="true">MACK</span>
</a>

<style>
	.mark {
		display: inline-flex;
		align-items: center;
		gap: 1px;
		color: var(--ink);
		text-decoration: none;
		font-size: 30px;
		font-weight: 300;
		font-stretch: 75%;
		line-height: 1;
		letter-spacing: 0.01em;
	}

	img {
		width: 40px;
		height: 40px;
	}

	@media (hover: hover) and (pointer: fine) {
		.mark:hover {
			color: var(--link-hover);
		}
	}
</style>
