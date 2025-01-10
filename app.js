const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("../voucher-app/routes/auth.routes");
const dashboardRoutes = require("../voucher-app/routes/dashboard.routes");
const voucherRoutes = require("../voucher-app/routes/voucher.routes");
const db = require("../voucher-app/config/database");

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

app.use(authRoutes);
app.use(dashboardRoutes);
app.use('/voucher',voucherRoutes);

//start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
