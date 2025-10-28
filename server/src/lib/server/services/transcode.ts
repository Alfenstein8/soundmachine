import { audio, type FfmpegAudioOptions } from 'bun-ffmpeg';

const wavOptions: FfmpegAudioOptions = {
	codec: 'pcm_s16le',
	channels: 2,
	sampleRate: 44100,
	onError: (error) => console.error('Error processing audio:', error)
};

export const transcodeToWav = async (input: string, output: string) => {
	if (!output.toLowerCase().endsWith('.wav')) {
		console.warn(`Output path '${output}' does not end with .wav.`);
	}
	await audio(input, output, wavOptions);
};

const mp3Options: FfmpegAudioOptions = {
	codec: 'mp3',
	bitrate: '128k',
	channels: 2,
	sampleRate: 44100,
	onError: (error) => console.error('Error processing audio:', error)
};

export const transcodeToMp3 = async (input: string, output: string) => {
	if (!output.toLowerCase().endsWith('.mp3')) {
		console.warn(`Output path '${output}' does not end with .mp3.`);
	}
	await audio(input, output, mp3Options);
};
