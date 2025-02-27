const qrcode = require("qrcode");
const db = require("../config/database");
const moment = require("moment");
const sql = require("mssql");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const VoucherController = {
  async generateVoucher(req, res) {
    try {
      const pool = await db;

      const settingsResult = await pool
        .request()
        .query(`SELECT voc_max_expiry_time FROM settings WHERE id = 1`);
      const settings = settingsResult.recordset[0];

      if (!settings) {
        return res.status(404).send("Settings not found.");
      }

      const maxExpiryTime = settings.voc_max_expiry_time || 30; // Default to 30 Days if not found

      const voucherNumber =
        req.body.voucher_number ||
        Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const currentDate = new Date();
      const vocGeneratedDate = req.body.voc_generated_date
        ? new Date(req.body.voc_generated_date)
        : currentDate;

      const vocExpiryDate = req.body.voc_expiry_date
        ? new Date(req.body.voc_expiry_date)
        : new Date(vocGeneratedDate);
      vocExpiryDate.setDate(vocGeneratedDate.getDate() + maxExpiryTime);

      const qrCodeData = await qrcode.toDataURL(
        JSON.stringify({
          voucherNumber: voucherNumber,
          vocGeneratedDate: moment(vocGeneratedDate).format("ddd MMM DD YYYY"),
          vocExpiryDate: moment(vocExpiryDate).format("ddd MMM DD YYYY"),
        })
      );

      await pool
        .request()
        .input("voucherNumber", sql.BigInt, voucherNumber)
        .input("vocGeneratedDate", sql.DateTime, vocGeneratedDate)
        .input("vocExpiryDate", sql.DateTime, vocExpiryDate)
        .input("qrCodeData", sql.VarChar, qrCodeData)
        .query(
          "INSERT INTO vouchers (voc_number,voc_generated_date,voc_expiry_date,voc_qr_code) VALUES (@voucherNumber,@vocGeneratedDate,@vocExpiryDate,@qrCodeData)"
        );

      const vouchers = await VoucherController.getAllVouchers();
      res.render("dashboard", {
        vouchers: vouchers,
        alert: {
          type: "success",
          title: "Voucher Generated.",
          text: "Voucher Generated Sucessfully..!",
        },
      });
    } catch (error) {
      console.error("Error generating voucher: ", error);
      res.status(500).send("Error genrating Voucher");
    }
  },

  async getAllVouchers() {
    try {
      const pool = await db;
      const result = await pool.request().query("SELECT * FROM vouchers");

      return result.recordset.map((ele) => ({
        ...ele,
        voc_generated_date: moment(ele.voc_generated_date).format(
          "ddd MMM DD YYYY"
        ),
        voc_expiry_date: moment(ele.voc_expiry_date).format("ddd MMM DD YYYY"),
      }));
    } catch (error) {
      console.error("Error Fetching Vouchers: ", error);
      res.status(500).send("Error Fetching Vouchers");
    }
  },

  async generatePdf(req, res) {
    try {
      const voucherNumber = req.params.voucherNumber;
      const pool = await db;
      const result = await pool
        .request()
        .input("voucher_number", voucherNumber)
        .query("SELECT * FROM vouchers WHERE voc_number = @voucher_number");

      if (!result.recordset) {
        res.status(404).send("Voucher not Found..!");
      }

      const voucher = result.recordset[0];

      const settingsResult = await pool
        .request()
        .query(
          `SELECT voc_width, voc_height, voc_title, voc_text FROM settings WHERE id = 1`
        );
      const settings = settingsResult.recordset[0];

      if (!settings) {
        return res.status(404).send("Settings not found.");
      }

      const { voc_width, voc_height, voc_title, voc_text } = settings;

      const pdfPath = `public/pdfs/voucher_${voucher.voc_number}.pdf`;

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      const margin = 40;
      const width = doc.page.width - margin * 2;
      const height = doc.page.height - margin * 2;
      doc.rect(margin, margin, width, height).stroke();

      doc
        .fontSize(voc_title || 20)
        .moveDown(1)
        .text("Voucher Details", {
          align: "center",
          underline: true,
          lineGap: 10,
        })
        .moveDown(1);

      doc
        .fontSize(voc_text || 14)
        .text(`Voucher Number : ${voucher.voc_number}`, { align: "center" })
        .moveDown()
        .text(
          `Generated Date : ${moment(voucher.voc_generated_date).format(
            "ddd MMM DD YYYY"
          )}`,
          { align: "center" }
        )
        .moveDown()
        .text(
          `Expiry Date : ${moment(voucher.voc_expiry_date).format(
            "ddd MMM DD YYYY"
          )}`,
          { align: "center" }
        )
        .moveDown(1);

      const qrCode = Buffer.from(voucher.voc_qr_code.split(",")[1], "base64");

      doc.image(qrCode, {
        fit: [voc_height || 250, voc_width || 250],
        align: "center",
        x: (doc.page.width - (voc_width || 250)) / 2,
        y: (doc.page.height - (voc_height || 250)) / 2,
      });

      doc.end();

      stream.on("finish", () => {
        res.download(pdfPath, `voucher_${voucher.voc_number}.pdf`, (err) => {
          if (err) {
            console.error("Error downloading PDF: ", err);
          }
        });
      });
    } catch (error) {
      console.error("Error while generating PDF...! ", error);
      res.status(500).send("Error Generating PDF");
    }
  },

  async printVoucher(req, res) {
    try {
      const voucherNumber = req.params.voucherNumber;
      const pool = await db;
      const result = await pool
        .request()
        .input("voucher_number", voucherNumber)
        .query("SELECT * FROM vouchers WHERE voc_number = @voucher_number");

      if (!result.recordset) {
        return res.status(404).send("Voucher not Found..!");
      }

      const voucher = result.recordset[0];

      res.render("print-voucher", {
        voucher: {
          ...voucher,
          voc_generated_date: `${moment(voucher.voc_generated_date).format(
            "ddd MMM DD YYYY"
          )}`,
          voc_expiry_date: `${moment(voucher.voc_expiry_date).format(
            "ddd MMM DD YYYY"
          )}`,
        },
      });
    } catch (error) {
      console.error("Error printing voucher:", error);
      res.status(500).send("Error Printing Voucher");
    }
  },
};

module.exports = VoucherController;
