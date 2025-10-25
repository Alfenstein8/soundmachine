import { db } from '$lib/server/db';
import { slots } from '$lib/server/db/schema';
import type { ServerInit } from '@sveltejs/kit';

type slotInsert = typeof slots.$inferInsert;
export const init: ServerInit = async () => {
	if ((await db.select().from(slots)).length === 8*8) {
	    return;
	  }
	await db.delete(slots);
	const slotsArray: slotInsert[] = [];
	for (let i = 0; i < 8*8; i++) {
		slotsArray.push({});
	}
	await db.insert(slots).values(slotsArray);

	console.log('Setting slots');
};
