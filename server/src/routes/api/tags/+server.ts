import * as db from '$db';
import type { TagInsert, TagSelect } from '$types/db';
import type { RequestEvent } from './$types';
import { parse, tagInsertSchema } from '$lib/server/validators';

export const GET = async () => {
	let tagList: TagSelect[] = [];
	try {
		tagList = await db.getAllTags();
	} catch {
		return new Response('Failed to fetch tags', { status: 500 });
	}

	return new Response(JSON.stringify(tagList), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export const POST = async ({ request }: RequestEvent) => {
	let tagData: TagInsert;
	try {
		tagData = parse(tagInsertSchema, await request.json());
	} catch {
		return new Response('Invalid JSON', { status: 400 });
	}
	try {
		await db.insertTag(tagData);
	} catch {
		return new Response('Failed to create tag', { status: 500 });
	}
	return new Response('Tag created', { status: 201 });
};

export const DELETE = async () => {
	try {
		await db.deleteAllTags();
	} catch {
		return new Response('Failed to delete tags', { status: 500 });
	}
	return new Response('All tags deleted', { status: 200 });
};
