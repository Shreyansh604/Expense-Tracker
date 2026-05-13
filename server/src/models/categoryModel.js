import pool from "../db/db.js";

export const getCategories = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM categories 
         WHERE user_id = $1 OR user_id IS NULL 
         ORDER BY name`,
        [userId]
    );
    return result.rows;
};

export const createCategory = async (userId, name) => {
    const result = await pool.query(
        `INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *`,
        [userId, name]
    );
    return result.rows[0];
};

export const deleteCategory = async (id, userId) => {
    const result = await pool.query(
        `DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId]
    );
    return result.rows[0];
};