import * as db from '$db';

export const GET = async () => {
	let resSlots;
	let resSamples;
	let resLayers;
	Promise.all([
		(resSlots = await db.getAllSlots()),
		(resSamples = await db.getAllSamples()),
		(resLayers = await db.getAllLayers())
	]);

	return new Response(JSON.stringify({ slots: resSlots, samples: resSamples, layers: resLayers }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
