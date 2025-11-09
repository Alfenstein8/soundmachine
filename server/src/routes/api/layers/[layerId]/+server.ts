import { db } from '$lib/server/db';
import { layers, slots} from '$schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';
import type { LayerInsert } from '$types/db';

export const DELETE = async ({ params }: RequestEvent) => {
	let id: number;

	try {
		id = Number(params.layerId);
	} catch {
		return new Response('Invalid layer ID', { status: 400 });
	}
	try {
		Promise.all([
			await db.delete(layers).where(eq(layers.id, id)),
			await db.delete(slots).where(eq(slots.layerId, id))
		]);
		return new Response(null, { status: 204 });
	} catch {
		return new Response('Failed to delete layer', { status: 500 });
	}
};

export const PATCH = async ({ params, request }: RequestEvent) => {
	let layer: LayerInsert;
	let id: number;
	try {
		layer = await request.json();
		id = Number(params.layerId);
	} catch {
		return new Response('Invalid request', { status: 400 });
	}

	try {
		await db.update(layers).set(layer).where(eq(layers.id, id));

		if (layer.id !== undefined) {
			await db.update(slots).set({ layerId: layer.id }).where(eq(slots.layerId, id));
		}
		return new Response('Layer updated', { status: 200 });
	} catch {
		return new Response('Failed to update layer', { status: 500 });
	}
};
