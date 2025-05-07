const AUTH_QUERIES = {
	// -- Register -- //
	// SELECT
	SELECT_CUSTOMERS_BY_EMAIL: 'SELECT email FROM authentication WHERE email = ?',
	// INSERT
	INSERT_CUSTOMER: `INSERT INTO customers (first_name, last_name, date_of_birth, phone, admin) VALUES (?, ?, ?, ?, ?)`,
	INSERT_AUTHENTICATION: `INSERT INTO authentication (customer_id, email, password) VALUES (?, ?, ?)`,
};

export { AUTH_QUERIES };
