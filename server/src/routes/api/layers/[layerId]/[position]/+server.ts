import * as db from '$db';
import { parse, positionValidator } from '$lib/server/validators';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const DELETE = async ({ params }: RequestEvent) => {
	const layerId = Number(params.layerId);
	let position = Number(params.position);

	try {
		position = parse(positionValidator, position);
	} catch {
		return error(400, 'Invalid position');
	}

	if (isNaN(position) || position < 0 || !Number.isInteger(position)) {
		return new Response('Invalid position', { status: 400 });
	}
	try {
		await db.deleteSlot(layerId, position);
	} catch {
		return new Response('Failed to delete slot', { status: 500 });
	}
	return new Response(null, { status: 204 });
};
