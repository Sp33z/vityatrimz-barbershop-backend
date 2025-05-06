import { createPool } from 'mysql2/promise';
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

// Function to execute a query on the database
// This function takes a SQL query and parameters as input and returns the results
const query = async (sql: string, params: Array<string | number>) => {
	const [results] = await pool.query(sql, params);
	return results;
};

export { query };
