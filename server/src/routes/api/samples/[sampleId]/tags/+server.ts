import * as db from '$db';
import type { RequestEvent } from './$types';
import type { TagSelect } from '$types/db';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }: RequestEvent) => {
	try {
		const tagList: TagSelect[] = await db.getTagsBySampleId(params.sampleId);

		return new Response(JSON.stringify(tagList), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response('Failed to fetch tags for sample', { status: 500 });
	}
};

export const POST = async ({ params, request }: RequestEvent) => {
	let res: { tagNames: string[]; primaryTagName: string };
	let tagNames: string[];
	let primaryTagName: string;
	try {
		res = await request.json();
		tagNames = res.tagNames;
		primaryTagName = res.primaryTagName;
	} catch {
		return error(400, 'Invalid request body');
	}
	try {
		// Delete existing tags
		await db.deleteTagAttachmentsBySampleId(params.sampleId);
		// Insert tags
		const newTags = tagNames.map((tagName) => ({ tagName, sampleId: params.sampleId }));
		if (newTags.length > 0) {
			await db.putTagAttachments(newTags);
		}
	} catch {
		return error(500, 'Failed to associate tags with sample');
	}

	// Update primary tag
	try {
		await db.patchSample(params.sampleId, { primaryTagName });
	} catch {
		return error(500, 'Failed to update primary tag for sample');
	}
	return new Response(null, { status: 204 });
};
