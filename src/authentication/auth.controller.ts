import { Request, Response } from 'express';
import { signupValidator } from './auth.validator';

const login = async (req: Request, res: Response): Promise<void> => {
	res.json({ message: 'Logged in successfully' });
};

const register = async (req: Request, res: Response): Promise<void> => {
	const { error, value } = signupValidator(req.body);

	if (error) {
		res.status(400).json({ error: error.details[0].message });
		return;
	}

	console.log(value);

	res.status(201).json({ message: 'Registered successfully' });
};

export { login, register };
