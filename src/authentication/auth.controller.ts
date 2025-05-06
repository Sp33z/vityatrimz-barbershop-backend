import { Request, Response } from 'express';
import { signupValidator } from './auth.validator';
import { AppError } from '../utils/app.error';

const register = (req: Request, res: Response) => {
	const { error, value } = signupValidator(req.body);

	if (error) {
		throw new AppError(error.details[0].message, 400); // Create a new AppError instance with the error message
	}

	console.log(value);

	res.status(201).json({ message: 'Registered successfully' });
};

const login = async (req: Request, res: Response): Promise<void> => {
	res.json({ message: 'Logged in successfully' });
};

const logout = async (req: Request, res: Response): Promise<void> => {
	res.json({ message: 'Logged out successfully' });
};

const me = async (req: Request, res: Response): Promise<void> => {
	res.json({ message: 'User data' });
};

export { login, register, logout, me };
