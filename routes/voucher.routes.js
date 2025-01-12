const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucher.controller");

router.post("/generate-voucher", voucherController.generateVoucher);
router.get ("/generate-pdf/:voucherNumber",voucherController.generatePdf);
router.get('/all-vouchers',voucherController.getAllVouchers);

module.exports = router;
