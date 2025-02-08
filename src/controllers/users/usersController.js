const { User } = require("../../models/users/usersModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const response = require("../../utils/response");
const schoolsModel = require("../../models/schools/schoolsModel");
const dotenv = require("dotenv");

const usersController = {

  signUp: async (req, res) => {
    console.log("Received signup request:", req.body);

    const { username, password, confirmPassword, email, school_id } = req.body;

    // Validasi input
    if (!username || !password || !confirmPassword || !email || !school_id) {
      console.log("Missing required fields:", { username, email, school_id });
      return response(400, "Semua data harus diisi", "error", res);
    }

    if (password !== confirmPassword) {
      console.log("Password mismatch");
      return response(400, "Password dan konfirmasi password tidak cocok", "error", res);
    }

    try {
      // Cek email
      console.log("Checking email:", email);
      const existingUserByEmail = await User.findOne({ where: { email } });
      if (existingUserByEmail) {
        console.log("Email already exists");
        return response(400, "Email sudah terdaftar", "error", res);
      }

      // Cek username
      console.log("Checking username:", username);
      const existingUserByUsername = await User.findOne({ where: { username } });
      if (existingUserByUsername) {
        console.log("Username already exists");
        return response(400, "Username sudah terdaftar", "error", res);
      }

      // Hash password
      console.log("Hashing password");
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Buat user baru
      console.log("Creating new user");
      const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
        school_id
      });

      console.log("User created successfully:", newUser);

      return response(200, {
        username: newUser.username,
        email: newUser.email,
        school_id: newUser.school_id
      }, "Pendaftaran berhasil", res);

    } catch (error) {
      console.error("Detailed error in signup:", error);
      return response(500, "Terjadi kesalahan di server", "error", res);
    }
  },
 

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      console.log("Email tidak diberikan"); // Log jika email tidak ada
      return response(400, "Email harus diisi", "error", res);
    }

    try {
      // Cari user berdasarkan email
      console.log(`Mencari user dengan email: ${email}`);
      const user = await User.findOne({ where: { email } });

      if (!user) {
        console.log(`Email ${email} tidak ditemukan di database`);
        return response(404, "Email tidak ditemukan", "error", res);
      }

      // Generate OTP (6 digit)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Generated OTP untuk reset password: ${otp}`);

      // Simpan OTP ke dalam remember_token
      user.remember_token = otp;
      await user.save();
      console.log(`OTP disimpan dalam remember_token untuk email: ${email}`);

      // Kirim OTP ke email pengguna menggunakan nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Ganti dengan email Anda
          pass: process.env.EMAIL_PASS, // Ganti dengan password email Anda
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP untuk Reset Password",
        html: ` 
          <html>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc; color: #333;">
              <!-- Outer Table for Full Width -->
              <table role="presentation" style="width: 100%; background-color: #f4f7fc; padding: 20px 0;">
                <tr>
                  <td align="center">
                    <!-- Inner Table for Centered Content -->
                    <table role="presentation" style="width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); padding: 20px; border: 1px solid #ddd;">
                      <!-- Header Section -->
                      <tr>
                        <td style="text-align: center; padding-bottom: 20px;">
                          <h2 style="color: #007bff; margin: 0;">Reset Password Anda</h2>
                        </td>
                      </tr>
                      <!-- OTP Body Section -->
                      <tr>
                        <td style="padding: 0 20px 20px 20px;">
                          <p>Hallo,</p>
                          <p>Untuk mereset password Anda, masukkan OTP berikut:</p>
                          <h3 style="background-color: #007bff; color: #ffffff; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; margin: 20px 0 30px 0;">
                            ${otp}
                          </h3>
                          <p>Harap jangan bagikan kode ini kepada siapapun. Kode OTP ini hanya berlaku untuk sesi ini dan akan kadaluarsa dalam beberapa menit.</p>
                          <p>Jika Anda tidak merasa meminta reset password, Anda dapat mengabaikan email ini.</p>
                        </td>
                      </tr>
                      <!-- Footer Section -->
                      <tr>
                        <td style="text-align: center; padding-top: 20px; font-size: 12px; color: #777;">
                          <footer>
                            <p>Terima kasih telah menggunakan layanan kami.</p>
                            <p style="font-size: 10px;">Jika Anda mengalami masalah atau memiliki pertanyaan, silakan hubungi tim kami.</p>
                          </footer>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      };

      console.log(`Mempersiapkan untuk mengirim email ke ${email}...`);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error mengirim email:", error);
          return response(500, "Gagal mengirim email", "error", res);
        } else {
          console.log(
            `Email berhasil dikirim ke ${email}. Response: ${info.response}`
          );
          return response(
            200,
            { message: "OTP telah dikirim ke email Anda" },
            "OTP terkirim",
            res
          );
        }
      });
    } catch (error) {
      console.error("Error di handler forgot password:", error);
      return response(500, "Internal server error", "error", res);
    }
  },

  verifyOtp: async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
      console.log("OTP tidak diberikan");
      return response(400, "OTP harus diisi", "error", res);
    }

    try {
      // Cari user berdasarkan OTP
      console.log(`Mencari user dengan OTP: ${otp}`);
      const user = await User.findOne({ where: { remember_token: otp } });

      if (!user) {
        console.log(`OTP ${otp} tidak ditemukan atau sudah kadaluarsa`);
        return response(
          404,
          "OTP tidak ditemukan atau sudah kadaluarsa",
          "error",
          res
        );
      }

      // OTP valid, lanjutkan untuk reset password
      console.log("OTP valid, silakan atur ulang password");
      return response(
        200,
        { message: "OTP valid. Silakan atur ulang password" },
        "OTP terverifikasi",
        res
      );
    } catch (error) {
      console.error("Error di handler verify OTP:", error);
      return response(500, "Internal server error", "error", res);
    }
  },

  resetPassword: async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    // Cek apakah password lama, password baru, dan konfirmasi password telah diberikan
    if (!newPassword || !confirmPassword) {
      console.log("password baru atau konfirmasi password tidak diberikan");
      return response(
        400,
        " password baru dan konfirmasi password harus diisi",
        "error",
        res
      );
    }

    // Validasi apakah password baru dan konfirmasi password cocok
    if (newPassword !== confirmPassword) {
      console.log("Password baru dan konfirmasi password tidak cocok");
      return response(
        400,
        "Password baru dan konfirmasi password harus cocok",
        "error",
        res
      );
    }

    try {
      // Cari user berdasarkan remember_token (OTP yang sudah disimpan)
      console.log(
        "Mencari user berdasarkan remember_token (OTP yang disimpan)"
      );
      const user = await User.findOne({ where: { remember_token: otp } });

      if (!user) {
        console.log("Token OTP tidak ditemukan atau sudah kadaluarsa");
        return response(
          404,
          "Token OTP tidak ditemukan atau sudah kadaluarsa",
          "error",
          res
        );
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("Password baru telah di-hash");

      // Update password pengguna
      user.password = hashedPassword;
      await user.save();

      console.log("Password berhasil direset untuk user:", user.email);

      // Reset OTP setelah password berhasil diubah
      user.remember_token = null;
      await user.save();
      console.log("OTP berhasil dihapus setelah reset password");

      return response(
        200,
        { message: "Password berhasil direset" },
        "Password berhasil diubah",
        res
      );
    } catch (error) {
      console.error("Error di handler reset password:", error);
      return response(500, "Internal server error", "error", res);
    }
  },

  login: async (req, res) => {
    const { username, password, school_id } = req.body;
    console.log("Login attempt:", { username, school_id }); // untuk debugging

    try {
      // Validasi input
      if (!username || !password || !school_id) {
        return response(400, "Username, password, dan sekolah harus diisi", "error", res);
      }

      // Cari user berdasarkan username dan school_id
      const user = await User.findOne({ where: { username, school_id } });
      console.log("Found user:", user); // untuk debugging

      if (!user) {
        return response(404, "User tidak ditemukan di sekolah tersebut", "error", res);
      }

      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return response(401, "Password salah", "error", res);
      }

      // Generate token
      const token = jwt.sign(
        { 
          userId: user.id,
          username: user.username,
          school_id: user.school_id 
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return response(200, {
        token,
        user: {
          username: user.username,
          school_name: user.school_name
        }
      }, "Login berhasil", res);

    } catch (error) {
      console.error("Login error:", error);
      return response(500, "Terjadi kesalahan di server", "error", res);
    }
  },

  getAllUser: async (req, res) => {
    try {
      const users = await User.findAll();
      response(200, users, "ambil semua data user", res);
    } catch (error) {
      response(500, "gagal", "error", res);
    }
  },

  getUserByUsername: async (req, res) => {
    const username = req.params.username;
    try {
      const user = await User.findOne({ where: { username } });
      if (user) {
        response(200, user, "ambil detail data user", res);
      } else {
        response(404, "data tidak ada", "error", res);
      }
    } catch (error) {
      response(500, "gagal", "error", res);
    }
  },

  createUser: async (req, res) => {
    const userData = req.body;
    try {
      const newUser = await User.create(userData);
      response(201, newUser, "data user berhasil ditambah", res);
    } catch (error) {
      response(500, "gagal", "error", res);
    }
  },

  updateUser: async (req, res) => {
    const username = req.params.username;
    const userData = req.body;
    try {
      const updatedCount = await User.update(userData, { where: { username } });
      if (updatedCount > 0) {
        response(
          200,
          { message: "update data user berhasil" },
          "update data user berhasil",
          res
        );
      } else {
        response(404, "data tidak ada", "error", res);
      }
    } catch (error) {
      response(500, "gagal", "error", res);
    }
  },

  updatePassword: async (req, res) => {
    const { username } = req.params; // Ambil username dari parameter
    const { newPassword } = req.body; // Ambil newPassword dari body request

    console.log("Received request to update password for user:", username); // Log username

    try {
      // Cek apakah password baru sudah ada
      if (!newPassword) {
        console.log("Password baru kosong");
        return response(400, "Password baru tidak boleh kosong", "error", res);
      }

      console.log(
        "Valid password received, updating password for user:",
        username
      );

      // Hash password baru sebelum menyimpannya
      const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 adalah tingkat salt rounds

      // Panggil model untuk mengupdate password
      const updatedCount = await User.update(
        { password: hashedPassword },
        { where: { username } }
      );

      if (updatedCount > 0) {
        console.log(`Password berhasil diupdate untuk user ${username}`);
        response(
          200,
          { message: "Password berhasil diupdate" },
          "Update password berhasil",
        );
      } else {
        console.log(`Data user dengan username ${username} tidak ditemukan`);
        response(404, "Data user tidak ditemukan", "error", res);
      }
    } catch (error) {
      console.error("Error di handler update password:", error);
      response(500, "Internal server error", "error", res);
    }
  },

  deleteUser: async (req, res) => {
    const { username } = req.body;
    try {
      const deletedCount = await User.destroy({ where: { username } });
      if (deletedCount > 0) {
        response(200, { isDeleted: true }, "delete data user berhasil", res);
      } else {
        response(404, "data tidak ada", "error", res);
      }
    } catch (error) {
      response(500, "gagal", "error", res);
    }
  },
};

module.exports = usersController;
