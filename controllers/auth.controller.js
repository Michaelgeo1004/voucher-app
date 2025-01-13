const db = require("../config/database");
const bcrypt = require("bcryptjs");
const voucherController = require("../controllers/voucher.controller");

const AuthController = {
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const pool = await db;

      const result = await pool
        .request()
        .input("username", username)
        .query("SELECT * FROM users WHERE user_name = @username");

      const user = result.recordset[0];
      if (!user) {
        return res.render("login", {
          alert: {
            type: "error",
            title: "Login Failed",
            text: "User not found!",
          },
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        req.session.isAuthenticated = true;
        req.session.user = { id: user.id, username: user.user_name };

        const vouchers = await voucherController.getAllVouchers();
        return res.render("dashboard", {
          alert: {
            type: "success",
            title: "Login Successful",
            text: "Redirecting to your dashboard..!",
          },
          vouchers: vouchers,
        });
      } else {
        return res.render("login", {
          alert: {
            type: "error",
            title: "Login Failed",
            text: "Invalid user credentials",
          },
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.render("login", {
        alert: {
          type: "error",
          title: "Error",
          text: "An error occurred. Please try again later.",
        },
      });
    }
  },

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.render("dashboard", {
          alert: {
            type: "error",
            title: "Error",
            text: "An error occurred. Please try again later.",
          },
        });
      }
      return res.render("login", {
        alert: {
          type: "success",
          title: "Logging Out..!",
          text: "Logged Out Sucessfully.",
        },
      });
    });
  },
};

module.exports = AuthController;
