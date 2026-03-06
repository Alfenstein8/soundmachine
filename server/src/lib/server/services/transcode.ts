import { spawn } from 'node:child_process';

/**
 * Executes a raw FFmpeg command
 */
const runFfmpeg = (args: string[]): Promise<void> => {
	return new Promise((resolve, reject) => {
		// 'ffmpeg' must be in your system PATH
		const process = spawn('ffmpeg', ['-y', ...args]);

		process.stderr.on('data', (data) => {
			// FFmpeg logs progress and errors to stderr by default
			// You can parse this for specific error strings if needed
		});

		process.on('close', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`FFmpeg exited with code ${code}`));
		});

		process.on('error', (err) => {
			reject(err);
		});
	});
};

export const transcodeToWav = async (input: string, output: string) => {
	if (!output.toLowerCase().endsWith('.wav')) {
		console.warn(`Output path '${output}' does not end with .wav.`);
	}

	await runFfmpeg(['-i', input, '-acodec', 'pcm_s16le', '-ac', '2', '-ar', '44100', output]);
};

export const transcodeToMp3 = async (input: string, output: string) => {
	if (!output.toLowerCase().endsWith('.mp3')) {
		console.warn(`Output path '${output}' does not end with .mp3.`);
	}

	await runFfmpeg([
		'-i',
		input,
		'-codec:a',
		'libmp3lame',
		'-b:a',
		'128k',
		'-ac',
		'2',
		'-ar',
		'44100',
		output
	]);
};
