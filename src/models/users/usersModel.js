const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db/connection');
const bcrypt = require("bcrypt");

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  school_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  remember_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false
});

const getAllUser = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error(`Error getting users: ${error.message}`);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email }
    });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by email: ${error.message}`);
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({
      where: { username }
    });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by username: ${error.message}`);
  }
};

const createUser = async (userData) => {
  try {
    const { username, password, email, school_id } = userData;
    const newUser = await User.create({ username, password, email, school_id });
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const updateUser = async (id, userData) => {
  try {
    const { username, email, password } = userData;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const updatedUser = await User.update(
      {
        username: username || undefined,
        email: email || undefined,
        password: hashedPassword || undefined
      },
      {
        where: { id },
        returning: true,
        plain: true
      }
    );
    return updatedUser[1]; // Mengembalikan data pengguna yang diperbarui
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const deleteUser = async (id) => {
  try {
    const deletedCount = await User.destroy({
      where: { id }
    });
    return deletedCount; // Mengembalikan jumlah row yang terpengaruh
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

const getUserByUsernameAndSchool = async (username, school_id) => {
  try {
    const user = await User.findOne({
      where: { username, school_id }
    });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by username and school: ${error.message}`);
  }
};

module.exports = {
  User,
  getAllUser,
  getUserByEmail,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsernameAndSchool
};
