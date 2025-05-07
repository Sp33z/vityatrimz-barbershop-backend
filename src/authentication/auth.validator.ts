import Joi from 'joi';

const validator = (schema: Joi.ObjectSchema) => (payload: Joi.ObjectSchema) =>
	schema.validate(payload);

// -- Signup Validator -- //

const signupSchema = {
	// Define the schema for signup validation
	first_name: Joi.string().min(3).max(30).required(), // First name must be between 3 and 30 characters
	last_name: Joi.string().min(3).max(30).required(), // Last name must be between 3 and 30 characters
	date_of_birth: Joi.date().max(new Date('2015-01-01')).required(), // Date of birth must be before 2015-01-01
	phone: Joi.string()
		.regex(/^\+?[0-9]{10,15}$/)
		.required(), // Phone number must be a valid format (e.g., +1234567890 or 1234567890)
	email: Joi.string().email().required(), // Email must be a valid email format
	password: Joi.string().min(8).max(30).required(), // Password must be between 8 and 30 characters
	confirm_password: Joi.string().valid(Joi.ref('password')).required(), // Confirm password must match the password
};

const signupValidator = validator(Joi.object(signupSchema)); // Create a validator function using the signup schema

// -- Login Validator -- //

const loginSchema = {
	email: Joi.string().email().required(), // Email must be a valid email format
	password: Joi.string().min(8).max(30).required(), // Password must be between 8 and 30 characters
};

const loginValidator = validator(Joi.object(loginSchema)); // Create a validator function using the login schema

export { signupValidator, loginValidator };
