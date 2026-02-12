import express, { Request, Response } from 'express';
import * as youtubeService from './services/youtubeService';
import * as ffmpegService from './services/ffmpegService';
import path from 'path';

const router = express.Router();

// Helper to handle async route errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Health check
router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Yapp API is running' });
});

// Get Video Info
router.get('/info', asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  const info = await youtubeService.getVideoInfo(url);
  res.json(info);
}));

// Download Video
router.post('/download', asyncHandler(async (req: Request, res: Response) => {
  const { url, format } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const filePath = await youtubeService.downloadVideo(url, format);
  res.json({ 
    message: 'Download successful', 
    filePath,
    fileName: path.basename(filePath)
  });
}));

// Extract Audio
router.post('/process/audio', asyncHandler(async (req: Request, res: Response) => {
  const { filePath } = req.body;
  
  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const audioPath = await ffmpegService.extractAudio(filePath);
  res.json({ 
    message: 'Audio extraction successful', 
    filePath: audioPath,
    fileName: path.basename(audioPath)
  });
}));

// Trim Video
router.post('/process/trim', asyncHandler(async (req: Request, res: Response) => {
  const { filePath, start, duration } = req.body;
  
  if (!filePath || !start || !duration) {
    return res.status(400).json({ error: 'File path, start time and duration are required' });
  }

  const trimmedPath = await ffmpegService.trimVideo(filePath, start, duration);
  res.json({ 
    message: 'Video trim successful', 
    filePath: trimmedPath,
    fileName: path.basename(trimmedPath)
  });
}));

export default router;
