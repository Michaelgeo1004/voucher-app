const db = require("../config/database");

const Vouchermodel = {
  async getAllVouchers() {
    try {
      const pool = await db;
      const allVouchers = await pool.request().query("SELECT * FROM vouchers");
      return allVouchers.recordsets;
    } catch (error) {
      console.error("Error fetching Vouchers:", error);
      throw errro;
    }
  },

  // async createVoucher(vocInterface: VoucherInteface) {
  //   try {
  //     const pool = await db;
  //     const query = `INSERT INTO vouchers (voc_number,voc_generated_date,voc_expiry_date,voc_qr_code) VALUES (@vocInterface.voc_number,@vocInterface.voc_generated_date,@vocInterface.voc_expiry_date,@vocInterface.voc_qr_code)`;
  //     await pool.request()
  //     .input("vocInterface.voc_number",sql.BigInt,vocInterface.voc_number)
  //     .input("vocInterface.voc_generated_date",sql.DateTime,vocInterface.voc_generated_date)
  //     .input("vocInterface.voc_expiry_date",sql.DateTime,vocInterface.voc_expiry_date)
  //     .input("vocInterface.voc_qr_code",sql.VarChar,vocInterface.voc_qr_code)
  //     .query(query)
  //   } catch (error) {
  //     console.error("Error creating voucher:", error);
  //     throw error;
  //   }
  // },
};

const VoucherInteface = {
  voc_number,
  voc_generated_date,
  voc_expiry_date,
  voc_qr_code,
};

module.exports = VoucherInteface
module.exports= Vouchermodel
