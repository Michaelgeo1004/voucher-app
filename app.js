const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const voucherRoutes = require("./routes/voucher.routes");
const settingRoutes = require("./routes/settings.routes");

const app = express();

// Set up the view engine
app.set("view engine", "ejs");

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Session Setup
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static('public'));

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(voucherRoutes);
app.use(settingRoutes);

//start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
