import { readFileSync } from 'node:fs';
import { sign, Algorithm } from 'jsonwebtoken';
import { config } from '../config/config';
import { pool, ResultSetHeader } from '../database/database';
import { TOKEN_QUERIES } from './token.queries';

// Read the access and refresh token keys from the file system
const accessTokenKey = readFileSync(
	'src/infrastructure/keys/access.token.key',
	'utf8'
);

const refreshTokenKey = readFileSync(
	'src/infrastructure/keys/refresh.token.key',
	'utf8'
);

// Create a new token row for a user when they register
const createTokenRow = async (userID: number): Promise<void> => {
	await pool.query<ResultSetHeader>(TOKEN_QUERIES.INSERT_ROW_FOR_USER, [
		userID,
	]);

	return;
};

// Update the access token for a user when they log in or expire
const updateAccessToken = async (
	userID: number,
	ip: string
): Promise<string> => {
	// Create a new access token encoded with the user ID and IP address
	const accessToken = sign({ id: userID, ip: ip }, accessTokenKey, {
		algorithm: config.jwt.algorithm as Algorithm,
		expiresIn: config.jwt.accessTokenExpires,
	});

	// Update the access token in the database for the given user ID
	await pool.query<ResultSetHeader>(TOKEN_QUERIES.UPDATE_ACCESS_TOKEN_BY_ID, [
		accessToken,
		userID,
	]);

	return accessToken;
};

// Update the refresh token for a user when they log in
const updateRefreshToken = async (
	userID: number,
	ip: string
): Promise<string> => {
	// Create a new refresh token encoded with the user ID and IP address
	const refreshToken = sign({ id: userID, ip: ip }, refreshTokenKey, {
		algorithm: config.jwt.algorithm as Algorithm,
		expiresIn: config.jwt.refreshTokenExpires,
	});

	// Update the refresh token in the database for the given user ID
	await pool.query<ResultSetHeader>(
		TOKEN_QUERIES.UPDATE_REFRESH_TOKEN_AND_IP_BY_ID,
		[refreshToken, ip, userID]
	);

	return refreshToken;
};

// Update both the access and refresh tokens for a user when they log in or refresh
const updateTokens = async (userID: number, ip: string): Promise<string> => {
	// Create the new tokens for the user
	const accessToken = await updateAccessToken(userID, ip);
	await updateRefreshToken(userID, ip);

	return accessToken;
};

export { createTokenRow, updateAccessToken, updateRefreshToken, updateTokens };
