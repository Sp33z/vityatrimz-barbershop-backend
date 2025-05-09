import { Router } from 'express';
import { login, logout, register } from './auth.controller';

const authRouter = Router();

authRouter.post('/login', login); // Controller is only used *here*, not exported directly
authRouter.post('/register', register);
authRouter.post('/logout', logout);

export { authRouter }; // ✅ Export the Router
