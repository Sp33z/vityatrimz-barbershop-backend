import express from 'express';
import cors from 'cors';
import { authRouter } from './authentication/auth.router';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

export { app };
