import { db } from '$lib/server/db';
import type { RequestEvent } from './$types';
import { samples, type SampleInsert, type SampleSelect } from '$lib/server/db/schema';
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

const getSampleData = (formData: FormData): SampleInsert => {
  const sampleDataEntry = formData.get('data');

  if (!sampleDataEntry) {
    throw error(400, { message: "No sample data provided in 'data' field." });
  }

  return JSON.parse(sampleDataEntry.toString());
}

const getAudioFile = (formData: FormData) => {
  const fileEntry = formData.get('audio');

  if (!fileEntry || !(fileEntry instanceof File)) {
    return error(400, { message: "No audio file provided in 'audioFile' field." });
  }

  return fileEntry;
};

export const POST = async ({ request }: RequestEvent) => {
  let audioFile: File;
  let sampleData: SampleInsert;
  let newSample: SampleSelect | null = null;

  try {
    const formData = await request.formData();


    sampleData = getSampleData(formData);

    const res = await db.insert(samples).values(sampleData).returning();
    newSample = res[0];

    audioFile = getAudioFile(formData);

    await saveSample(newSample.id, audioFile);
  } catch (e) {
    console.error('Error processing audio upload:', e);
    if (newSample?.id) {
      await db.delete(samples).where(eq(samples.id, newSample.id));
    }
    return error(500, { message: 'Failed to save audio file.' });
  }

  return json(newSample);
};

export const GET = async () => {
  const allSamples = await db.select().from(samples);
  return json(allSamples);
};
