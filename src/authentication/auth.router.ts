import { Router } from 'express';
import { login, register } from './auth.controller';

const authRouter = Router();

authRouter.post('/login', login); // Controller is only used *here*, not exported directly
authRouter.post('/register', register);

export { authRouter }; // ✅ Export the Router
