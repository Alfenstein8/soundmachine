import * as db from '$db';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
	if ((await db.getAllLayers()).length > 0) {
		return;
	}
	await db.createLayer({ id: 0, name: 'Default' });

	console.log('Setting slots');
};
