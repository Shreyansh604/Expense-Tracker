import pool from "../db/db.js";

const createTransaction = async(data) => {
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

const getTransactions = async (userId) => {
  const query = `
    SELECT * FROM transactions
    WHERE user_id = $1
    ORDER BY date DESC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

const updateTransaction = async (id, data) => {
  const query = `
    UPDATE transactions
    SET amount = $1,
        type = $2,
        category_id = $3,
        description = $4,
        date = $5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    data.amount,
    data.type,
    data.category_id,
    data.description,
    data.date,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteTransaction = async (id) => {
  const query = `
    DELETE FROM transactions
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
}