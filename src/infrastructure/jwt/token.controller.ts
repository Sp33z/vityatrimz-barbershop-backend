import { readFileSync } from 'node:fs';
import { sign, Algorithm, verify, JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';
import { pool, ResultSetHeader, RowDataPacket } from '../database/database';
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

// Remove all tokens for a user when they log out
const removeUserTokens = async (accessToken: string): Promise<void> => {
	await pool.query<ResultSetHeader>(
		TOKEN_QUERIES.CLEAR_TOKENS_AND_IP_BY_ACCESS_TOKEN,
		[accessToken]
	);

	return;
};

// Decode the access token to get the user ID and IP address
const decodeAccessToken = (accessToken: string): { id: number; ip: string } => {
	// Declare the returnable variables
	let { id, ip } = { id: 0, ip: '' };

	// Verify the access token using the access token key
	verify(accessToken, accessTokenKey, (err, result) => {
		if (err || !result || typeof result === 'string') {
			return;
		}

		// Update the id and ip variables with the decoded token data
		id = result.id;
		ip = result.ip;
	});

	return { id, ip };
};

// Decode the refresh token to get the user ID and IP address
const decodeRefreshToken = async (
	accessToken: string
): Promise<{ id: number; ip: string }> => {
	// Declare the returnable variablesx
	let { id, ip } = { id: 0, ip: '' };

	// Get the refresh token from the database for the given user ID
	const [refreshTokens] = await pool.query<RowDataPacket[]>(
		TOKEN_QUERIES.SELECT_REFRESH_TOKEN_BY_ACCESS_TOKEN,
		[accessToken]
	);

	// Get the refresh token from the row data
	const refreshToken = refreshTokens[0]?.refresh;

	// Decode the refresh token
	const decodedRefreshToken = verify(
		refreshToken,
		refreshTokenKey
	) as JwtPayload;

	// If the refresh token is valid, update the id and ip variables with the decoded token data
	id = decodedRefreshToken.id;
	ip = decodedRefreshToken.ip;

	return { id, ip };
};

export {
	createTokenRow,
	updateAccessToken,
	updateRefreshToken,
	updateTokens,
	removeUserTokens,
	decodeAccessToken,
	decodeRefreshToken,
};
