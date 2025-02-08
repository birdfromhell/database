const response = require("../../utils/response");
const { UserImageHistory } = require("../../models/userImageHistory/userImageHistoryModel");
const path = require("path");

const userImageHistoryController = {
    createUserImageHistory: async (req, res) => {
        try {
            const { date, status, time, location, user_id } = req.body;
            const photo = req.file ? req.file.filename : null;
            const newUserImageHistory = await UserImageHistory.create({ date, photo, status, time, location, user_id });
            const imageUrl = photo ? `${req.protocol}://${req.get('host')}/images/${photo}` : null;
            response(201, { ...newUserImageHistory.toJSON(), photo: imageUrl }, "User image history created successfully", res);
        } catch (error) {
            response(500, error.message, "ERROR", res);
        }
    },

    getAllUserImageHistory: async (req, res) => {
        try {
            const userImageHistories = await UserImageHistory.findAll();
            const userImageHistoriesWithUrls = userImageHistories.map(history => ({
                ...history.toJSON(),
                photo: history.photo ? `${req.protocol}://${req.get('host')}/images/${history.photo}` : null
            }));
            response(200, userImageHistoriesWithUrls, "SUCCESS", res);
        } catch (error) {
            response(500, error.message, "ERROR", res);
        }
    },

    getUserImageHistoryByUserId: async (req, res) => {
        try {
            const { user_id } = req.params;
            const userImageHistories = await UserImageHistory.findAll({
                where: { user_id },
                order: [['date', 'DESC']]
            });
            const userImageHistoriesWithUrls = userImageHistories.map(history => ({
                ...history.toJSON(),
                photo: history.photo ? `${req.protocol}://${req.get('host')}/images/${history.photo}` : null
            }));
            response(200, userImageHistoriesWithUrls, "SUCCESS", res);
        } catch (error) {
            response(500, error.message, "ERROR", res);
        }
    }
};

module.exports = userImageHistoryController;
