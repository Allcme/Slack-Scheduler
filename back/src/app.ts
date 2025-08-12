import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { PORT } from './env';
import authRoutes from './routes/auth';
import messagesRouter from './routes/messages';
import { startScheduler } from './services/SchedulerServices';

const app = express();

app.use(cors());
app.use(express.json()); // replaces bodyParser.json()

// Mount auth routes under /api/auth (optional: keep consistent with /api prefix)
app.use('/auth', authRoutes);

// Mount messages routes under /api/messages
app.use('/api/messages', messagesRouter);

// Start your scheduler service
startScheduler();

// Start server if running this file directly (optional)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
