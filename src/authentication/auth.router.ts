import { Router } from 'express';
import { login, logout, me, register } from './auth.controller';
import { jwtHandler } from '../middlewares/jwt.handler.middleware';

const authRouter = Router();

authRouter.post('/login', login); // Controller is only used *here*, not exported directly
authRouter.post('/register', register);
authRouter.post('/logout', logout);

authRouter.use(jwtHandler); // Middleware for jwt validation

authRouter.get('/me', me); // Example route to get user info

export { authRouter }; // ✅ Export the Router
