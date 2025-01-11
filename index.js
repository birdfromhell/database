const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const response = require("./src/utils/response");
const os = require("os");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // This replaces body-parser
app.use(cors());
// Routes
const usersRoutes = require("./src/routes/users/usersRoutes");
app.use("/api/users", usersRoutes);

const schoolsRoutes = require("./src/routes/schools/schoolsRoutes");
app.use("/api/schools", schoolsRoutes);

const attendanceRoutes = require("./src/routes/attendance/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);

// Root endpoint
app.get("/", (req, res) => {
  response(200, "API v1 ready to go", "SUCCESS", res);
});

// Get the server's IP address
const networkInterfaces = os.networkInterfaces();
let ipAddress = "";
for (const interface in networkInterfaces) {
  for (const net of networkInterfaces[interface]) {
    if (net.family === "IPv4" && !net.internal) {
      ipAddress = net.address;
    }
  }
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});
