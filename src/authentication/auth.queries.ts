const AUTH_QUERIES = {
	// SELECT
	SELECT_CUSTOMERS_BY_EMAIL: 'SELECT * FROM authentication WHERE email = ?',

	// INSERT
	INSERT_CUSTOMER: `INSERT INTO customers (first_name, last_name, date_of_birth, phone, admin) VALUES (?, ?, ?, ?, ?)`,
	INSERT_AUTHENTICATION: `INSERT INTO authentication (customer_id, email, password) VALUES (?, ?, ?)`,
};

export { AUTH_QUERIES };
