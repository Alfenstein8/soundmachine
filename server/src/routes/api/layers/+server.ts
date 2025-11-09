import { type LayerInsert } from '$types/db';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import * as db from '$db';
import { parse, layerInsertSchema } from '$lib/server/validators';

export const GET = async () => {
	try {
		const allLayers = await db.getAllLayers();
		return json(allLayers);
	} catch (error) {
		console.error('Error fetching layers:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const POST = async ({ request }: RequestEvent) => {
	let layer: LayerInsert;
	try {
		layer = parse(layerInsertSchema, await request.json());
	} catch {
		return error(400, { message: 'Invalid layer data provided.' });
	}

	try {
		await db.createLayer(layer);
		return new Response('Layer created', { status: 201 });
	} catch (error) {
		console.error('Error creating layer:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
