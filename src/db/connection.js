const Client = require("pg").Pool;
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "absensi_sekola",
  password: "141414",
  port: 5432,
  ssl: { rejectUnauthorized: false } // Ensure a secure connection
});

client.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected ");
  }
});
module.exports = client;
