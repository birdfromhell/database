const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "absensi_sekola",
    password: process.env.DB_PASSWORD || "141414",
    port: process.env.DB_PORT || 5432,
});

const UserImageHistory = {
    add: async (date, photo, status, time, location, user_id) => {
        try {
            const result = await pool.query(
                'INSERT INTO user_image_history (date, photo, status, time, location, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [date, photo, status, time, location, user_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error adding user image history: ${error.message}`);
        }
    },

    getAll: async () => {
        try {
            const result = await pool.query(`
                SELECT 
                    TO_CHAR(date, 'YYYY-MM-DD') as date,
                    photo,
                    status,
                    time,
                    location,
                    user_id
                FROM user_image_history 
                ORDER BY date DESC
            `);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting user image history: ${error.message}`);
        }
    },

    getByUserId: async (user_id) => {
        try {
            const result = await pool.query(`
                SELECT 
                    TO_CHAR(date, 'YYYY-MM-DD') as date,
                    photo,
                    status,
                    time,
                    location,
                    user_id
                FROM user_image_history 
                WHERE user_id = $1
                ORDER BY date DESC
            `, [user_id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting user image history by user_id: ${error.message}`);
        }
    }
};

module.exports = UserImageHistory;
