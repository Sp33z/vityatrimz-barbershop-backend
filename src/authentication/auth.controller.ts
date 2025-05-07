import { Request, Response } from 'express';
import { loginValidator, signupValidator } from './auth.validator';
import { AppError } from '../utils/app.error';
import { AUTH_QUERIES } from './auth.queries';

import {
	pool,
	RowDataPacket,
	ResultSetHeader,
} from '../infrastructure/database/database';

import {
	comparePassword,
	encryptPassword,
} from '../infrastructure/bcrypt/password.handler';

// -- Register -- //
const register = async (req: Request, res: Response) => {
	// Validate the request body using the signupValidator
	const { error, value } = signupValidator(req.body);

	// Create a new AppError instance with the error message if validation fails
	if (error) {
		throw new AppError(error.details[0].message, 406);
	}

	// Check if the email already exists in the database
	const [users] = await pool.query<RowDataPacket[]>(
		AUTH_QUERIES.SELECT_CUSTOMERS_BY_EMAIL,
		[value.email]
	);

	// If the email already exists, throw an AppError with a 409 status code
	if (users.length > 0) {
		throw new AppError('Email already exists', 409); // Email already exists
	}

	// If the email does not exist, proceed to insert the new user into the database
	const [result] = await pool.query<ResultSetHeader>(
		AUTH_QUERIES.INSERT_CUSTOMER,
		[
			// Insert the new user into the database
			value.first_name,
			value.last_name,
			value.date_of_birth,
			value.phone,
			0,
		]
	);

	// If the insertion is successful, insert the authentication details into the database
	await pool.query<ResultSetHeader>(AUTH_QUERIES.INSERT_AUTHENTICATION, [
		result.insertId,
		value.email,
		encryptPassword(value.password), // Encrypt the password before storing it
	]);

	// If the insertion is successful, send a success response
	res.status(201).json({ message: 'Registered successfully' });
};

// -- Login -- //
const login = async (req: Request, res: Response): Promise<void> => {
	// Validate the request body using the loginValidator
	const { error, value } = loginValidator(req.body);

	// Create a new AppError instance with the error message if validation fails
	if (error) {
		throw new AppError(error.details[0].message, 406);
	}

	// Check if the email exists in the database
	const [users] = await pool.query<RowDataPacket[]>(
		AUTH_QUERIES.SELECT_CUSTOMERS_BY_EMAIL,
		[value.email]
	);

	// If the email does not exist, throw an AppError with a 404 status code
	if (users.length === 0) {
		throw new AppError('Email does not exist', 404);
	}

	// If the password does not match, throw an AppError with a 401 status code
	if (!comparePassword(value.password, users[0].password)) {
		throw new AppError('Invalid password', 401);
	}

	// If the email and password are valid, proceed to log in the user
	res.status(200).json({
		message: 'Logged in successfully',
	});
};

const logout = async (req: Request, res: Response): Promise<void> => {
	res.json({ message: 'Logged out successfully' });
};

const me = async (req: Request, res: Response): Promise<void> => {
	res.json({ message: 'User data' });
};

export { login, register, logout, me };
