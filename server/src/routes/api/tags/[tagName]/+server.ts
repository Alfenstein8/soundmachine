import * as db from '$db';
import { parse, tagUpdateSchema } from '$lib/server/validators';
import type { RequestEvent } from './$types';

export const DELETE = async ({ params }: RequestEvent) => {
	try {
		await db.deleteTagByName(params.tagName);
	} catch {
		return new Response('Failed to delete tag', { status: 500 });
	}

	return new Response('Tag deleted', { status: 200 });
};

export const PATCH = async ({ params, request }: RequestEvent) => {
	try {
		const newTag = parse(tagUpdateSchema, await request.json());
		await db.patchTagByName(params.tagName, newTag);

		return new Response('Tag updated', { status: 200 });
	} catch (e) {
		console.error(e);

		return new Response('Failed to update tag', { status: 500 });
	}
};
