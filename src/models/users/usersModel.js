const client = require("../../db/connection");
const bcrypt = require("bcrypt");

const usersModel = {
  getAllUser: async () => {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  },

  getUserByEmail: async (email) => {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await client.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw error;
    }
  },

  getUserByUsername: async (username) => {
    try {
      const query = "SELECT * FROM users WHERE username = $1";
      const result = await client.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const { username, password, email, school_id } = userData;
      const query = `
        INSERT INTO users (username, password, email, school_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, school_id
      `;
      const values = [username, password, email, school_id];
      console.log("Executing query with values:", values);
      
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    const { username, email, password } = userData;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const sql = `
      UPDATE users 
      SET 
        username = COALESCE($1, username), 
        email = COALESCE($2, email), 
        password = COALESCE($3, password) 
      WHERE id = $4
      RETURNING *`;
    const result = await client.query(sql, [
      username,
      email,
      hashedPassword,
      id,
    ]);
    return result.rows[0]; // Mengembalikan data pengguna yang diperbarui
  },

  deleteUser: async (id) => {
    const sql = "DELETE FROM users WHERE id = $1";
    const result = await client.query(sql, [id]);
    return result.rowCount; // Mengembalikan jumlah row yang terpengaruh
  },

  getUserByUsernameAndSchool: async (username, school_id) => {
    try {
      const query = `
        SELECT u.*, s.name as school_name 
        FROM users u 
        JOIN schools s ON u.school_id = s.id 
        WHERE u.username = $1 AND u.school_id = $2
      `;
      const result = await client.query(query, [username, school_id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error in getUserByUsernameAndSchool:", error);
      throw error;
    }
  },
};

module.exports = usersModel;
