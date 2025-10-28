import { samples, slots } from '$schema';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { transcodeToMp3, transcodeToWav } from './transcode';
import { mkdir } from 'node:fs/promises';

const uploadPath = './uploads';
const samplesPath = `${uploadPath}/samples`;
const originalsPath = `${uploadPath}/originals`;
const streamsPath = `${uploadPath}/streams`;
const wavMimeTypes = ['audio/wav', 'audio/x-wav', 'audio/wave', 'audio/vnd.wave'];
const mp3MimeTypes = ['audio/mpeg', 'audio/mp3'];

const isWavFile = (mimeType: string) => {
	return wavMimeTypes.includes(mimeType);
};

const isMp3File = (mimeType: string) => {
	return mp3MimeTypes.includes(mimeType);
};

export const saveSample = async (id: string, file: File) => {
	const audioBuffer = await file.arrayBuffer();
	const ori = `${originalsPath}/${id}`;
	const samp = `${samplesPath}/${id}.wav`;
	const stream = `${streamsPath}/${id}.mp3`;

	await mkdir(samplesPath, { recursive: true });
	await mkdir(originalsPath, { recursive: true });
	await mkdir(streamsPath, { recursive: true });

	Bun.write(ori, audioBuffer);

	if (isWavFile(file.type)) {
		Bun.write(samp, audioBuffer);
		transcodeToMp3(ori, stream);
		return;
	}
	if (isMp3File(file.type)) {
		Bun.write(stream, audioBuffer);
		transcodeToWav(ori, samp);
		return;
	}
	transcodeToMp3(ori, stream);
	transcodeToWav(ori, samp);
};

export const getSample = async (id: string) => {
	const file = Bun.file(`${samplesPath}/${id}.wav`);
	if (!file.exists()) {
		throw new Error('Sample not found');
	}

	return file.arrayBuffer();
};

/**
 * @throws {Error} If the file does not exist
 */
const deleteFile = (filePath: string) => {
	const file = Bun.file(filePath);
	if (!file.exists()) {
		throw new Error('File not found');
	}
	file.delete();
};

export const deleteSample = async (id: string) => {
	try {
		await db.update(slots).set({ sampleId: null }).where(eq(slots.sampleId, id));
		await db.delete(samples).where(eq(samples.id, id));
	} catch {
		throw new Error('Failed to delete sample record from database');
	}
	deleteFile(`${samplesPath}/${id}.wav`);
	deleteFile(`${originalsPath}/${id}`);
	deleteFile(`${streamsPath}/${id}.mp3`);
};
