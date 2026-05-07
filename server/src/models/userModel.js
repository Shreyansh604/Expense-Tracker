import pool from "../db/db.js";

export const createUser = async ({ name, email, password }) => {
    const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
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

export const findUserById = async (userId) => {
    const result = await pool.query(
        `SELECT id, email, name, password, refresh_token 
         FROM users 
         WHERE id = $1`,
        [userId]
    );

    return result.rows[0];
};

export const updateUserPassword = async (userId, password) => {
    await pool.query(
        `UPDATE users SET password = $1 WHERE id = $2`,
        [password, userId]
    );
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