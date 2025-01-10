const voucherController = require("../controllers/voucher.controller");

const DashboardController = {
    
  async getDashboard(req, res) {
    try {
      const result = await voucherController.getAllVouchers();
      res.render("dashboard", { vouchers: result.vouchers });
    } catch (error) {
      console.error("Error while Fetching Dashboard Data..! ", error);
      throw error;
    }
  },
};

module.exports = DashboardController;
