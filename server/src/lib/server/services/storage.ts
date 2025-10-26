import { samples, slots } from '$schema';
import { eq } from 'drizzle-orm';
import { db } from '../db';

const uploadPath = './uploads';
const samplesPath = `${uploadPath}/samples`;

export const saveSample = async (id: string, file: File) => {
  const audioBuffer = await file.arrayBuffer();
  Bun.write(`${samplesPath}/${id}`, audioBuffer);
};

export const getSample = async (id: string) => {
  const file = Bun.file(`${samplesPath}/${id}`);
  if (!file.exists()) {
    throw new Error('Sample not found');
  }

  return file.arrayBuffer();
};

export const deleteSample = async (id: string) => {
  try {
    await db.update(slots).set({ sampleId: null }).where(eq(slots.sampleId, id));
    await db.delete(samples).where(eq(samples.id, id));
  } catch {
    throw new Error('Failed to delete sample record from database');
  }
  const filePath = `${samplesPath}/${id}`;
  const file = Bun.file(filePath);
  if (!file.exists()) {
    throw new Error('Sample not found');
  }
  file.delete();
};
