import * as db from '$db';

export const GET = async () => {
	const resSlots = await db.getAllSlots();
	const resSamples = await db.getAllSamples();
	const resLayers = await db.getAllLayers();

	return new Response(JSON.stringify({ slots: resSlots, samples: resSamples, layers: resLayers }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
