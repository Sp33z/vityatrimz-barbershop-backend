import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';
import {
	decodeAccessToken,
	decodeRefreshToken,
	updateAccessToken,
} from '../infrastructure/jwt/token.controller';
import { requestIP } from '../infrastructure/network/ip.detector';

const jwtHandler = async (req: Request, res: Response, next: NextFunction) => {
	// Check if the request has an authorization header
	if (!req.headers.authorization) {
		throw new AppError('Authorization header is missing', 401);
	}

	// Get the access token from the authorization header
	const accessToken: string = req.headers.authorization;
	const decodedAccessToken = decodeAccessToken(accessToken);

	// Check if the refresh token is valid
	const decodedRefreshToken = await decodeRefreshToken(accessToken);

	// If the refresh token's ip and the request's ip do not match, throw an error
	if (decodedRefreshToken.ip != requestIP(req)) {
		throw new AppError('IP address mismatch error', 401);
	}

	// If the access token is invalid, update it based on the refresh token
	if (decodedAccessToken.id == 0) {
		// Create the new access token, if the refresh token is valid
		const newAccessToken = await updateAccessToken(
			decodedRefreshToken.id,
			decodedRefreshToken.ip
		);
		// Set the new access token in the response header
		res.setHeader('Authorization', newAccessToken);
	}

	// If the access token is valid, set the user ID in the request object
	req.body.customer_id = decodedAccessToken.id;

	// If the access token is valid, continue to the next middleware
	next();
};

export { jwtHandler };
