const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db/connection');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'schools',
  timestamps: false
});

const getAllSchools = async () => {
  try {
    const schools = await School.findAll({
      order: [['name', 'ASC']]
    });
    return schools;
  } catch (error) {
    throw new Error(`Error getting schools: ${error.message}`);
  }
};

const getSchoolByName = async (name) => {
  try {
    const school = await School.findOne({
      where: { name }
    });
    return school;
  } catch (error) {
    throw new Error(`Error getting school by name: ${error.message}`);
  }
};

const getSchoolById = async (id) => {
  try {
    const school = await School.findByPk(id);
    return school;
  } catch (error) {
    throw new Error(`Error getting school by id: ${error.message}`);
  }
};

module.exports = {
  School,
  getAllSchools,
  getSchoolByName,
  getSchoolById
};
