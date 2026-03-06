import { transcodeToMp3, transcodeToWav } from './transcode';
import { mkdir, writeFile, readFile, unlink, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import * as db from '$db';

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
const fileExists = async (path: string) => {
	try {
		await access(path, constants.F_OK);
		return true;
	} catch {
		return false;
	}
};
export const saveSample = async (id: string, file: File) => {
	const arrayBuffer = await file.arrayBuffer();
	const audioBuffer = Buffer.from(arrayBuffer);
	const ori = `${originalsPath}/${id}`;
	const samp = `${samplesPath}/${id}.wav`;
	const stream = `${streamsPath}/${id}.mp3`;

	await mkdir(samplesPath, { recursive: true });
	await mkdir(originalsPath, { recursive: true });
	await mkdir(streamsPath, { recursive: true });

	writeFile(ori, audioBuffer);

	if (isWavFile(file.type)) {
		writeFile(samp, audioBuffer);
		transcodeToMp3(ori, stream);
		return;
	}
	if (isMp3File(file.type)) {
		writeFile(stream, audioBuffer);
		transcodeToWav(ori, samp);
		return;
	}
	transcodeToMp3(ori, stream);
	transcodeToWav(ori, samp);
};

export const getSample = async (id: string) => {
	const path = `${samplesPath}/${id}.wav`;

	if (!(await fileExists(path))) {
		throw new Error('Sample not found');
	}

	const buffer = await readFile(path);
	return buffer.buffer;
};

/**
 * @throws {Error} If the file does not exist
 */
const deleteFile = async (filePath: string) => {
	if (!(await fileExists(filePath))) {
		throw new Error('File not found');
	}
	// Replacement for file.delete()
	await unlink(filePath);
};

export const deleteSample = async (id: string) => {
	try {
		await db.deleteSample(id);
	} catch {
		throw new Error('Failed to delete sample record from database');
	}
	deleteFile(`${samplesPath}/${id}.wav`);
	deleteFile(`${originalsPath}/${id}`);
	deleteFile(`${streamsPath}/${id}.mp3`);
};
