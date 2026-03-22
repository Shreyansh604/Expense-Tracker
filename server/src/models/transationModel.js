import pool from "../config/db.js";

export const createTransaction = async() => {
    const query = `
        INSERT INTO transactions
        (users_id, amount, type, category_id, description, date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [
        data.user_id,
        data.amount,
        data.type,
        data.category_id,
        data.description,
        data.date,
    ];

  const result = await pool.query(query, values);
  return result.rows[0];
};