import { genSaltSync, hashSync, compareSync } from 'bcrypt'; // Importing bcrypt functions
import { config } from '../config/config'; // Importing configuration settings

// Function to encrypt a password using bcrypt
const encryptPassword = (password: string): string => {
	const saltRounds = config.bcrypt.saltRounds; // Number of salt rounds for bcrypt
	const salt = genSaltSync(saltRounds); // Generate a salt using the specified number of rounds
	const hashedPassword = hashSync(password, salt); // Hash the password with the generated salt

	return hashedPassword; // Placeholder for actual encryption logic
};

// Function to compare a plain password with a hashed password
const comparePassword = (password: string, hashedPassword: string): boolean => {
	return compareSync(password, hashedPassword); // Compare the plain password with the hashed password
};

export { encryptPassword, comparePassword };
