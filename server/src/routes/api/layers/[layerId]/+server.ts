import * as db from '$db';
import type { RequestEvent } from './$types';
import type { LayerInsert } from '$types/db';
import { parse, layerInsertSchema } from '$lib/server/validators';

export const DELETE = async ({ params }: RequestEvent) => {
	let id: number;

	try {
		id = Number(params.layerId);
	} catch {
		return new Response('Invalid layer ID', { status: 400 });
	}
	try {
		await db.deleteLayer(id);
		return new Response(null, { status: 204 });
	} catch {
		return new Response('Failed to delete layer', { status: 500 });
	}
};

export const PATCH = async ({ params, request }: RequestEvent) => {
	let layer: LayerInsert;
	let id: number;
	try {
		layer = parse(layerInsertSchema, await request.json());
		id = Number(params.layerId);
	} catch {
		return new Response('Invalid request data', { status: 400 });
	}

	try {
		await db.patchLayer(id, layer);
		return new Response('Layer updated', { status: 200 });
	} catch {
		return new Response('Failed to update layer', { status: 500 });
	}
};
