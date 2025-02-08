const Client = require("pg").Pool;
const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "absensi_sekola",
  password: process.env.DB_PASSWORD || "141414",
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false, sslmode: 'require' } // Ensure a secure connection
});

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected ");
  }
});
module.exports = client;
