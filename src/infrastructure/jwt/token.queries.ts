const TOKEN_QUERIES = {
	// SELECT
	SELECT_TOKENS_BY_ID: `SELECT * FROM tokens WHERE id = ?`,

	// INSERT
	INSERT_ROW_FOR_USER: `INSERT INTO tokens (customer_id, access, refresh, ip) VALUES (?, "", "", "")`,

	// UPDATE
	UPDATE_ACCESS_TOKEN_BY_ID: `UPDATE tokens SET access = ? WHERE customer_id = ?`,
	UPDATE_REFRESH_TOKEN_AND_IP_BY_ID: `UPDATE tokens SET refresh = ?, ip = ? WHERE customer_id = ?`,
};

export { TOKEN_QUERIES };
