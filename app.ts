import express from 'express';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler';

import skinlineRoutes from './routes/skinline';
import championRoutes from './routes/champion';
import skinRoutes from './routes/skin';
import sharedRoutes from './routes/shared';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(errorHandler);

app.use('/api/skinlines', skinlineRoutes);
app.use('/api/champions', championRoutes);
app.use('/api/skins', skinRoutes);
app.use('/api/shared', sharedRoutes);

export default app;
