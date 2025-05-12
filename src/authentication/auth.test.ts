import request from 'supertest';
import { app } from '../app';

// Access token for authentication
let accessToken: string = '';

// Define the user data for registration
const registerData = {
	first_name: 'John',
	last_name: 'Doe',
	date_of_birth: '2000-01-01',
	phone: '0123456789',
	email: 'john.doe@example.com',
	password: 'JohnDoe123',
	confirm_password: 'JohnDoe123',
};

// Define the user data for login
const loginData = {
	email: 'john.doe@example.com',
	password: 'JohnDoe123',
};

// -- Register New User -- //
describe('POST /api/auth/register', () => {
	it('should register the user with the credentials provided', async () => {
		// Try the registration with valid credentials
		const res = await request(app)
			.post('/api/auth/register')
			.send(registerData);
		// Check if the response status code is 201
		expect(res.statusCode).toBe(201);
	});
});

// -- Login User -- //
describe('POST /api/auth/login', () => {
	it('should login a user with valid credentials', async () => {
		// Try the login with valid credentials
		const res = await request(app).post('/api/auth/login').send(loginData);
		accessToken = res.body.accessToken;
		// Check if the response status code is 200
		expect(res.statusCode).toBe(200);
	});
});

// -- Me -- //
describe('GET /api/auth/me', () => {
	it('should return the user data', async () => {
		// Try to get the user data
		const res = await request(app)
			.get('/api/auth/me')
			.set('Authorization', `Bearer ${accessToken}`);
		console.log(res.body, accessToken);
		// Check if the response status code is 200
		expect(res.statusCode).toBe(200);
	});
});

// -- Logout User -- //
describe('POST /api/auth/logout', () => {
	it('should logout the user', async () => {
		// Try the logout
		const res = await request(app)
			.post('/api/auth/logout')
			.send({ accessToken });
		// Check if the response status code is 200
		expect(res.statusCode).toBe(200);
	});
});
