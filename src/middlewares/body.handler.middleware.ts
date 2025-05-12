import { Request, Response, NextFunction } from 'express';

const bodyHandler = (req: Request, res: Response, next: NextFunction) => {
	// Check if the request body is empty
	if (!req.body) {
		// If the body is empty, set it to an empty object
		req.body = {};
	}

	next(); // Proceed to the next middleware or route handler
};

export { bodyHandler };
