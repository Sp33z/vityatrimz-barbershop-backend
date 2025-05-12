import { Request, Response } from 'express';
import {
	loginValidator,
	logoutValidator,
	signupValidator,
} from './auth.validator';
import { AppError } from '../utils/app.error';
import { AUTH_QUERIES } from './auth.queries';
import { requestIP } from '../infrastructure/network/ip.detector';

import {
	pool,
	RowDataPacket,
	ResultSetHeader,
} from '../infrastructure/database/database';

import {
	comparePassword,
	encryptPassword,
} from '../infrastructure/bcrypt/password.handler';
import {
	createTokenRow,
	removeUserTokens,
	updateTokens,
} from '../infrastructure/jwt/token.controller';

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

	createTokenRow(result.insertId); // Create a token row for the new user

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

	// Update the tokens for the user
	const accessToken = await updateTokens(users[0].customer_id, requestIP(req));

	// If the email and password are valid, proceed to log in the user
	res.status(200).json({
		message: 'Logged in successfully',
		accessToken: accessToken,
	});
};

// -- Logout -- //
const logout = async (req: Request, res: Response): Promise<void> => {
	// Validate the request body using the loginValidator
	const { error, value } = logoutValidator(req.body);

	// Create a new AppError instance with the error message if validation fails
	if (error) {
		throw new AppError(error.details[0].message, 406);
	}

	// Remove the user's tokens from the database
	removeUserTokens(value.accessToken);

	// If the tokens are removed successfully, send a success response
	res.status(200).json({
		message: 'Logged out successfully',
	});
};

// -- Me -- //
const me = async (req: Request, res: Response): Promise<void> => {
	// Get the customer ID from the request body
	const customerId = req.body.customer_id;

	// Get the customer data from the database using the customer ID
	const [personalData] = await pool.query<RowDataPacket[]>(
		AUTH_QUERIES.SELECT_CUSTOMER_DATA_BY_ID,
		[customerId]
	);

	// Get the authentication data from the database using the customer ID
	const [authenticationData] = await pool.query<RowDataPacket[]>(
		AUTH_QUERIES.SELECT_AUTHENTICATION_DATA_BY_ID,
		[customerId]
	);

	// Send back the customer data as a response
	res.status(200).json({
		customer_id: customerId,
		first_name: personalData[0].first_name,
		last_name: personalData[0].last_name,
		date_of_birth: personalData[0].date_of_birth,
		phone: personalData[0].phone,
		email: authenticationData[0].email,
	});
};

export { login, register, logout, me };
