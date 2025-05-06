import express from 'express';
import cors from 'cors';

import { bodyHandler } from './middlewares/body.handler.middleware';
import { errorHandler } from './middlewares/error.handler.middleware';

import { authRouter } from './authentication/auth.router';

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyHandler); // Middleware to handle request body

// Routes
app.use('/api/auth', authRouter);

// 🚨 Error handler goes LAST
app.use(errorHandler);

export { app };
