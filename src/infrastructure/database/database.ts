import { createPool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { config } from '../config/config';

// Creating the pool to connect to the database
// This pool will be used to execute queries on the database
const pool = createPool({
	host: config.database.host,
	port: config.database.port,
	user: config.database.user,
	password: config.database.password,
	database: config.database.name,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// Adding a listener to handle connection errors
pool.addListener('error', (err) => {
	throw new Error(`Database connection error: ${err}`); // Handle database connection errors
});

export { pool, RowDataPacket, ResultSetHeader };
