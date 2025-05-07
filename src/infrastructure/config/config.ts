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
	jwt: {
		algorithm: process.env.JWT_ALGORITHM || 'HS256',
		accessTokenExpires: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES) || 10, // 10 minutes
		refreshTokenExpires:
			Number(process.env.JWT_REFRESH_TOKEN_EXPIRES) || 60 * 8, // 8 hours
	},
	bcrypt: {
		saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
	},
};

export { config };
