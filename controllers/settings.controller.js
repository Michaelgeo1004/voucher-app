const db = require("../config/database");

const SettingController = {
  async settingList(req, res) {
    try {
      const pool = await db;
      const result = await pool
        .request()
        .query(`SELECT * FROM settings WHERE id = 1`);

      const setting = result.recordset[0];
      if (setting) {
        res.render("settings", { setting });
      } else {
        res.status(404).send("Settings not found.");
      }
    } catch (error) {
      console.log("Error fetching settings: ", error);
      res.status(404).send("Error fetching settings");
    }
  },

  async createSettings(req, res) {
    try {
      const pool = await db;
      const setting = await pool
        .request()
        .input("vocMaxExpiryTime", req.body.vocMaxExpiryTime)
        .input("vocWidth", req.body.vocWidth)
        .input("vocHeight", req.body.vocHeight)
        .input("vocTitle", req.body.vocTitle)
        .input("vocText", req.body.vocText)
        .query(
          "INSERT INTO settings(voc_max_expiry_time,voc_width,voc_height,voc_title,voc_text) VALUES (@vocMaxExpiryTime,@vocWidth,@vocHeight,@vocTitle,@vocText)"
        );
      res.status(201).send("Settings Created Sucessfully..!");
      return setting;
    } catch (error) {
      console.log("Error Creating Voucher Settings..! :", error);
      throw error;
    }
  },

  async updateSettings(req, res) {
    try {
      const {
        vocMaxExpiryTime,
        vocWidth,
        vocHeight,
        vocTitle,
        vocText,
      } = req.body;

      const pool = await db;
      await pool
        .request()
        .input("vocMaxExpiryTime", vocMaxExpiryTime)
        .input("vocWidth", vocWidth)
        .input("vocHeight", vocHeight)
        .input("vocTitle", vocTitle)
        .input("vocText", vocText).query(`UPDATE settings SET 
            voc_max_expiry_time=@vocMaxExpiryTime,
            voc_width = @vocWidth, 
            voc_height = @vocHeight, 
            voc_title = @vocTitle, 
            voc_text = @vocText, 
            updated_at = GETDATE() 
            WHERE id = 1 `);
      res.redirect("/settings");
    } catch (error) {
      console.log("Error while Update Setting..! :", error);
      throw error;
    }
  },
};

module.exports = SettingController;
