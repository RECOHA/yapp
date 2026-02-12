const youtubedl = require('youtube-dl-exec');
import path from 'path';
import fs from 'fs';

const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

// Ensure download directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

export const getVideoInfo = async (url: string) => {
  try {
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });
    return output;
  } catch (error) {
    console.error('Error getting video info:', error);
    throw new Error('Failed to fetch video info');
  }
};

export const downloadVideo = async (url: string, format: string = 'mp4') => {
  try {
    const timestamp = Date.now();
    const outputTemplate = path.join(DOWNLOAD_DIR, `video_${timestamp}.%(ext)s`);

    await youtubedl(url, {
      format: format === 'mp3' ? 'bestaudio' : 'bestvideo+bestaudio/best',
      output: outputTemplate,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    // Find the file that was created (handling potential extension differences)
    // For simplicity in this demo, we assume the download worked and we search for the file with the timestamp prefix
    const files = fs.readdirSync(DOWNLOAD_DIR);
    const downloadedFile = files.find(f => f.startsWith(`video_${timestamp}`));
    
    if (!downloadedFile) {
      throw new Error('File not found after download');
    }

    return path.join(DOWNLOAD_DIR, downloadedFile);
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error('Failed to download video');
  }
};
