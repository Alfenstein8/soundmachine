import * as db from '$db';
import type { SlotSelect } from '$schema';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	let allSlots: SlotSelect[];
	try {
		allSlots = await db.getAllSlots();
	} catch {
		return new Response(null, { status: 500 });
	}
	return json(allSlots);
};
