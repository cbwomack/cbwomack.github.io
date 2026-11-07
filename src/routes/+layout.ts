// Every page is plain prerendered HTML. No client-side router: each link is a normal page load.
// The only scripts are plain files in static/ (the Disc on Home, the photo swap on About).
export const prerender = true;
export const csr = false;
