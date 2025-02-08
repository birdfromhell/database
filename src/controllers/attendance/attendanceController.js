const response = require("../../utils/response");
const { Attendance } = require("../../models/attendance/attendanceModel");

const attendanceController = {
    getAttendance: async (req, res) => {
        try {
            const attendances = await Attendance.findAll();
            response(200, attendances, "SUCCESS", res);
        } catch (error) {
            response(500, error.message, "ERROR", res);
        }
    },
    
    createAttendance: async (req, res) => {
        try {
            const { date, status, user_id, school_id } = req.body;
            const newAttendance = await Attendance.create({ date, status, user_id, school_id });
            response(201, newAttendance, "Attendance created successfully", res);
        } catch (error) {
            response(500, error.message, "ERROR", res);
        }
    }
};

module.exports = attendanceController;
