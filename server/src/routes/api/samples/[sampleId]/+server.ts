import { getSample, deleteSample } from '$lib/server/services/storage';
import * as db from '$db';

import type { RequestEvent } from './$types';
import type { SampleUpdate } from '$types/db';
import { parse } from 'valibot';
import { sampleUpdateSchema } from '$lib/server/validators';
import { error } from '@sveltejs/kit';

export async function GET({ params }: RequestEvent) {
	let file: ArrayBuffer;
	try {
		file = await getSample(params.sampleId);
	} catch (e) {
		console.error('Error retrieving audio file:', e);
		return new Response('Failed to retrieve audio file.', { status: 500 });
	}

	return new Response(file, {
		headers: {
			'Content-Type': 'audio/wav',
			'Content-Length': file.byteLength.toString(),
			'Content-Disposition': `attachment; filename="sample_${params.sampleId}.wav"`
		}
	});
}

export const DELETE = async ({ params }: RequestEvent) => {
	try {
		await deleteSample(params.sampleId);
		return new Response(null, { status: 204 });
	} catch (e) {
		console.error('Error deleting audio file:', e);
		return new Response('Failed to delete audio file.', { status: 500 });
	}
};

export const PATCH = async ({ params, request }: RequestEvent) => {
	let sample: SampleUpdate;

	try {
		sample = parse(sampleUpdateSchema, await request.json());
	} catch {
		return error(400);
	}

	try {
		await db.patchSample(params.sampleId, sample);
	} catch {
		return new Response('Failed to update sample metadata.', { status: 500 });
	}
	return new Response(null, { status: 204 });
};
