import * as db from '$db';
import type { RequestEvent } from './$types';
import type { SampleInsert, SampleSelect } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { saveSample } from '$lib/server/services/storage';

const getSampleData = (formData: FormData): SampleInsert => {
  const sampleDataEntry = formData.get('data');

  if (!sampleDataEntry) {
    throw error(400, { message: "No sample data provided in 'data' field." });
  }

  return JSON.parse(sampleDataEntry.toString());
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
  let sampleData: SampleInsert;
  let newSample: SampleSelect | null = null;

  try {
    const formData = await request.formData();

    sampleData = getSampleData(formData);

    const res = await db.insertSample(sampleData);
    newSample = res[0];

    audioFile = getAudioFile(formData);

    await saveSample(newSample.id, audioFile);
  } catch (e) {
    console.error('Error processing audio upload:', e);
    if (newSample?.id) {
      await db.deleteSample(newSample.id);
    }
    return error(500, { message: 'Failed to save audio file.' });
  }

  return json(newSample);
};

export const GET = async () => {
  const allSamples = await db.getAllSamples();
  return json(allSamples);
};
