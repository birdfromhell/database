const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db/connection');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    school_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'attendance',
    timestamps: false
});

const add = async (date, status, user_id, school_id) => {
    try {
        const newAttendance = await Attendance.create({ date, status, user_id, school_id });
        return newAttendance;
    } catch (error) {
        throw new Error(`Error adding attendance: ${error.message}`);
    }
};

const getAll = async () => {
    try {
        const attendances = await Attendance.findAll({
            order: [['date', 'DESC']]
        });
        return attendances;
    } catch (error) {
        throw new Error(`Error getting attendance: ${error.message}`);
    }
};

module.exports = {
    Attendance,
    add,
    getAll
};
