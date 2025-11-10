import * as db from '$db';
import { tagAttachmentInsertSchema } from '$lib/server/validators';
import type { tagAttachmentInsert } from '$types/db';
import { error, json } from '@sveltejs/kit';
import { array, parse } from 'valibot';
import type { RequestEvent } from './$types';

export const GET = async () => {
	const tagAttachments = await db.getAllTagAttachments();
	return json(tagAttachments);
};

export const PUT = async ({ request }: RequestEvent) => {
	let tagAttachments: tagAttachmentInsert[];

	try {
		tagAttachments = parse(array(tagAttachmentInsertSchema), await request.json());
	} catch {
		return error(400, 'Invalid tag attachment data');
	}

	try {
		await db.putTagAttachments(tagAttachments);
	} catch {
		return error(500, 'Failed to insert tag attachments');
	}
};
