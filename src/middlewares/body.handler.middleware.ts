import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';

const bodyHandler = (req: Request, res: Response, next: NextFunction) => {
	if (!req.body) {
		throw new AppError('Request body is missing', 403); // Throw an error if the body is not present
	}

	next(); // Proceed to the next middleware or route handler
};

export { bodyHandler };
