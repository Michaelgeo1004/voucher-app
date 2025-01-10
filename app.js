const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("../voucher-app/routes/auth.routes");
const dashboardRoutes = require("../voucher-app/routes/dashboard.routes");
const db = require("../voucher-app/config/database");

const app = express();

// Set up the view engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

//start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
