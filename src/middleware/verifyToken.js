const jwt = require("jsonwebtoken");
const response = require("../utils/response");

const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Mengambil token tanpa 'Bearer ' prefix

  if (!token) {
    return response(401, "Akses ditolak. Token tidak ditemukan.", "error", res);
  }

  try {
    // Verifikasi token menggunakan JWT_SECRET_KEY
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Menyimpan informasi user pada request (decoded token)
    next(); // Lanjutkan ke route yang dilindungi
  } catch (error) {
    return response(401, "Token tidak valid", "error", res);
  }
};

module.exports = verifyToken;
