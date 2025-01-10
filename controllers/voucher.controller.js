const qrcode = require("qrcode");
const db = require("../config/database");
const moment = require("moment");
const sql = require("mssql");

const VoucherController = {
  async generateVoucher(req, res) {
    try {
      const pool = await db;
      const voucherNumber =
        req.body.voucher_number ||
        Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const qrCodeData = await qrcode.toDataURL(voucherNumber);

      const currentDate = new Date();
      const vocGeneratedDate = req.body.voc_generated_date
        ? new Date(req.body.voc_generated_date)
        : currentDate;

      const vocExpiryDate = req.body.voc_expiry_date
        ? new Date(req.body.voc_expiry_date)
        : new Date(vocGeneratedDate);
      vocExpiryDate.setDate(vocGeneratedDate.getDate() + 30);

      await pool
        .request()
        .input("voucherNumber", sql.BigInt, voucherNumber)
        .input("vocGeneratedDate", sql.DateTime, vocGeneratedDate)
        .input("vocExpiryDate", sql.DateTime, vocExpiryDate)
        .input("qrCodeData", sql.VarChar, qrCodeData)
        .query(
          "INSERT INTO vouchers (voc_number,voc_generated_date,voc_expiry_date,voc_qr_code) VALUES (@voucherNumber,@vocGeneratedDate,@vocExpiryDate,@qrCodeData)"
        );

      // res.send({
      //   status: "success",
      //   message: "Voucher created successfully...!",
      //   voucher: {
      //     voucher_number: voucherNumber,
      //     generated_date: vocGeneratedDate,
      //     expiry_date: vocExpiryDate,
      //     qr_code_data: qrCodeData,
      //   },
      // });

      const { vouchers } = this.getAllVouchers();
      res.render("dashboard", {
        vouchers: vouchers.recordset,
        message: "Voucher Generated Sucessfully..!",
      });
    } catch (error) {
      console.error("Error generating voucher: ", error);
      res.status(500).send("Error genrating Voucher");
    }
  },

  async getAllVouchers(req, res) {
    try {
      const pool = await db;
      const result = await pool.request().query("SELECT * FROM vouchers");

      const allVouchers = result.recordset.map((ele) => {
        return {
          ...ele,
          voc_generated_date: moment(ele.voc_generated_date).format(
            "ddd MMM DD YYYY"
          ),
          voc_expiry_date: moment(ele.voc_expiry_date).format(
            "ddd MMM DD YYYY"
          ),
        };
      });
      return {
        status: "success",
        message: "Fetched Vouchers Successfully...!",
        vouchers: allVouchers,
      };
    } catch (error) {
      console.error("Error Fetching Vouchers: ", error);
      res.status(500).send("Error Fetching Vouchers");
    }
  },
};

module.exports = VoucherController;
