import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';

const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get the error parameters from the AppError instance
	const statusCode = err.statusCode || 500; // Use the error code or default to 500
	const errorMessage = err.message.toString() || 'Internal Server Error'; // Default to a generic error message

	// Log out the error details for debugging
	console.error('Error:', errorMessage); // Log the error message

	// Send the error response to the client
	res.status(statusCode).json({
		error: errorMessage, // Send the error message in the response
	});

	// Call the next middleware (if any)
	next();
};

export { errorHandler };
