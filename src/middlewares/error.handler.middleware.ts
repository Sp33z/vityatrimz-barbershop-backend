import { Request, Response, NextFunction } from 'express';

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errorMessage =
		err.message.split('\n')[0].toString() || 'Internal Server Error'; // Default to a generic error message

	console.error('Error:', errorMessage); // Log the error message

	res.status(500).json({
		error: errorMessage, // Send the error message in the response
	});

	next(); // Call the next middleware (if any)
};

export { errorHandler };
