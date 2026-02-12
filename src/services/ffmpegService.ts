import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

const PROCESSED_DIR = path.join(process.cwd(), 'processed');

// Ensure processed directory exists
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

export const extractAudio = (inputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(PROCESSED_DIR, `${filename}_audio.mp3`);

    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', () => resolve(outputPath))
      .on('error', (err: Error) => reject(err))
      .save(outputPath);
  });
};

export const trimVideo = (inputPath: string, startTime: string, duration: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(PROCESSED_DIR, `${filename}_trimmed${path.extname(inputPath)}`);

    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .on('end', () => resolve(outputPath))
      .on('error', (err: Error) => reject(err))
      .save(outputPath);
  });
};
