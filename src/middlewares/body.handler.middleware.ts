import { Request, Response, NextFunction } from 'express';

const bodyHandler = (req: Request, res: Response, next: NextFunction) => {
	if (!req.body) {
		throw new Error('Request body is missing'); // Throw an error if the body is not present
	}

	next(); // Proceed to the next middleware or route handler
};

export { bodyHandler };
