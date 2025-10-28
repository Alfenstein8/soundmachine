import { db } from '$lib/server/db';
import type { RequestEvent } from './$types';
import { samples } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { saveSample } from '$lib/server/services/storage';

const getFileName = (formData: FormData) => {
	const nameEntry = formData.get('name');
	if (!nameEntry || typeof nameEntry !== 'string' || nameEntry.trim() === '') {
		return error(400, { message: "No file name provided in 'fileName' field." });
	}
	return nameEntry.trim();
};

const getAudioFile = (formData: FormData) => {
	const fileEntry = formData.get('audio');

	if (!fileEntry || !(fileEntry instanceof File)) {
		return error(400, { message: "No audio file provided in 'audioFile' field." });
	}

	return fileEntry;
};

export const POST = async ({ request }: RequestEvent) => {
	let audioFile: File;
	let fileName: string;
	let newSampleId: string | null = null;

	try {
		const formData = await request.formData();

		fileName = getFileName(formData);

		const res = await db.insert(samples).values({ name: fileName }).returning();
		newSampleId = res[0].id;

		audioFile = getAudioFile(formData);

		saveSample(newSampleId, audioFile);
	} catch (e) {
		console.error('Error processing audio upload:', e);
		if (newSampleId) {
			await db.delete(samples).where(eq(samples.id, newSampleId));
		}
		return error(500, { message: 'Failed to save audio file.' });
	}

	return json({
		message: 'Added sample and saved audio',
		id: newSampleId
	});
};

export const GET = async () => {
	const allSamples = await db.select().from(samples);
	return json(allSamples);
};
