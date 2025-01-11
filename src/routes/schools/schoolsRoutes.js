const express = require("express");
const router = express.Router();
const schoolsController = require("../../controllers/schools/schoolsController");

router.get("/", schoolsController.getAllSchools);

module.exports = router; 