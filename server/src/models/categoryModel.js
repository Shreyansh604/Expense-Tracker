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