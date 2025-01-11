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

const Attendance = {
    add: async (date, status, user_id, school_id) => {
        try {
            const result = await pool.query(
                'INSERT INTO attendance (date, status, user_id, school_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [date, status, user_id, school_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error adding attendance: ${error.message}`);
        }
    },

    getAll: async () => {
        try {
            const result = await pool.query(`
                SELECT 
                    TO_CHAR(date, 'YYYY-MM-DD') as date,
                    status,
                    user_id,
                    school_id
                FROM attendance 
                ORDER BY date DESC
            `);
            return result.rows;
        } catch (error) {
            throw new Error(`Error getting attendance: ${error.message}`);
        }
    }
};

module.exports = Attendance;