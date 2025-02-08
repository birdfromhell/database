const express = require("express");
const router = express.Router();
const userImageHistoryController = require("../../controllers/userImageHistory/userImageHistoryController");
const uploadImage = require("../../middleware/uploadImage");

router.post("/", uploadImage.single("photo"), userImageHistoryController.createUserImageHistory);
router.get("/", userImageHistoryController.getAllUserImageHistory);
router.get("/:user_id", userImageHistoryController.getUserImageHistoryByUserId);

module.exports = router;
