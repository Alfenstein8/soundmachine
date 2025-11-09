import * as db from '$db';
import type { SlotInsert, SlotSelect } from '$types/db';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { parse, slotInsertSchema } from '$lib/server/validators';

export const GET = async () => {
	let allSlots: SlotSelect[];
	try {
		allSlots = await db.getAllSlots();
	} catch {
		return new Response(null, { status: 500 });
	}
	return json(allSlots);
};

export const PUT = async ({ request }: RequestEvent) => {
	let slot: SlotInsert;

	try {
		slot = parse(slotInsertSchema, await request.json());
	} catch {
		return new Response('Invalid JSON body', { status: 400 });
	}

	try {
		await db.putSlot(slot);
	} catch {
		return new Response('Failed to update slot', { status: 500 });
	}

	return new Response(null, { status: 204 });
};
