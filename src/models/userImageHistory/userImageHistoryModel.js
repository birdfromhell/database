const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db/connection');

const UserImageHistory = sequelize.define('UserImageHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'user_image_history',
    timestamps: false
});

const add = async (date, photo, status, time, location, user_id) => {
    try {
        const newUserImageHistory = await UserImageHistory.create({ date, photo, status, time, location, user_id });
        return newUserImageHistory;
    } catch (error) {
        throw new Error(`Error adding user image history: ${error.message}`);
    }
};

const getAll = async () => {
    try {
        const userImageHistories = await UserImageHistory.findAll({
            order: [['date', 'DESC']]
        });
        return userImageHistories;
    } catch (error) {
        throw new Error(`Error getting user image history: ${error.message}`);
    }
};

const getByUserId = async (user_id) => {
    try {
        const userImageHistories = await UserImageHistory.findAll({
            where: { user_id },
            order: [['date', 'DESC']]
        });
        return userImageHistories;
    } catch (error) {
        throw new Error(`Error getting user image history by user_id: ${error.message}`);
    }
};

module.exports = {
    UserImageHistory,
    add,
    getAll,
    getByUserId
};
