import express from 'express';
import cors from 'cors';
import router from './routes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (optional, to serve downloaded files directly)
app.use('/downloads', express.static(path.join(process.cwd(), 'downloads')));
app.use('/processed', express.static(path.join(process.cwd(), 'processed')));

// Routes
app.use('/api', router);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📂 Downloads dir: ${path.join(process.cwd(), 'downloads')}`);
});
