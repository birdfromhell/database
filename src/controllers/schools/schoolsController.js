const schoolsModel = require("../../models/schools/schoolsModel");
const response = require("../../utils/response");

const schoolsController = {
  getAllSchools: async (req, res) => {
    try {
      const schools = await schoolsModel.getAllSchools();
      return response(200, schools, "Data sekolah berhasil diambil", res);
    } catch (error) {
      console.error("Error getting schools:", error);
      return response(500, "Gagal mengambil data sekolah", "error", res);
    }
  }
};

module.exports = schoolsController; 