import { db } from '$lib/server/db';
import { layers, slots } from '$lib/server/db/schema';
import { createLayer } from '$lib/server/db/utils';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
	if ((await db.select().from(layers)).length > 0) {
		return;
	}
	await createLayer({ id: 0, name: 'Default' });

	console.log('Setting slots');
};
