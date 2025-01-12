const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settings.controller");

router.get("/settings", settingController.settingList);
router.post("/create-settings", settingController.createSettings);
router.post("/update-settings", settingController.updateSettings);

module.exports = router;
