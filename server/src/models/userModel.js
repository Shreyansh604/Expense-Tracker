import pool from "../db/db.js";

export const createUser = async ({ name, email, password }) => {
    const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
        [name, email, password]
    );

    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
};

export const saveRefreshToken = async (userId, refreshToken) => {
    const result = await pool.query(
        "UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING id, email",
        [refreshToken, userId]
    );

    return result.rows[0];
};

export const removeRefreshToken = async (userId) => {
    const result = await pool.query(
        "UPDATE users SET refresh_token = NULL WHERE id = $1",
        [userId]
    );

    return result.rowCount > 0;
};