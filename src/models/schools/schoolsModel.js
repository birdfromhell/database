const client = require("../../db/connection");

const schoolsModel = {
  getAllSchools: async () => {
    try {
      const query = "SELECT * FROM schools ORDER BY name";
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error in getAllSchools:", error);
      throw error;
    }
  },

  getSchoolByName: async (name) => {
    const query = "SELECT * FROM schools WHERE name = $1";
    const result = await client.query(query, [name]);
    return result.rows[0];
  },

  getSchoolById: async (id) => {
    const query = "SELECT * FROM schools WHERE id = $1";
    const result = await client.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = schoolsModel; 