import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import { uebaMiddleware } from './ueba/middleware.js';
import vehiclesRouter from './routes/vehicles.js';
import orchestratorRouter from './routes/orchestrator.js';
import schedulingRouter from './routes/scheduling.js';
import uebaRouter from './routes/ueba.js';
import insightsRouter from './routes/insights.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(uebaMiddleware);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/orchestrator', orchestratorRouter);
app.use('/api/scheduling', schedulingRouter);
app.use('/api/ueba', uebaRouter);
app.use('/api/insights', insightsRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auto_maintenance';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
