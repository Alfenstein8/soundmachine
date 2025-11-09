import * as db from '$db';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const tagAttachments = await db.getAllTagAttachments();
	return json(tagAttachments);
};
