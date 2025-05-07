import dotenv from 'dotenv';
import { myIP } from '../network/ip.detector';

dotenv.config();

const config = {
	server: {
		host: myIP() || 'localhost',
		port: Number(process.env.SERVER_PORT) || 3000,
	},
	database: {
		host: process.env.DB_HOST || 'localhost',
		port: Number(process.env.DB_PORT) || 3306,
		name: process.env.DB_NAME || 'my_database',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD,
	},
	bcrypt: {
		saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
	},
};

export { config };
