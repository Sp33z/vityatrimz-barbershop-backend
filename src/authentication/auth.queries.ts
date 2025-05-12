const AUTH_QUERIES = {
	// SELECT
	SELECT_CUSTOMERS_BY_EMAIL: 'SELECT * FROM authentication WHERE email = ?',
	SELECT_CUSTOMER_DATA_BY_ID: `SELECT first_name, last_name, date_of_birth, phone FROM customers WHERE id = ?`,
	SELECT_AUTHENTICATION_DATA_BY_ID: `SELECT email FROM authentication WHERE customer_id = ?`,

	// INSERT
	INSERT_CUSTOMER: `INSERT INTO customers (first_name, last_name, date_of_birth, phone, admin) VALUES (?, ?, ?, ?, ?)`,
	INSERT_AUTHENTICATION: `INSERT INTO authentication (customer_id, email, password) VALUES (?, ?, ?)`,
};

export { AUTH_QUERIES };
