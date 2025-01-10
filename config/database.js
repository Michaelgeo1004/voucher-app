const sql = require("mssql");

const dbConfig = {
  server: "localhost",
  database: "voucher_db",
  user: "admin",
  password: "root",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

const pool = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(() => console.log("Connected to Sql Server Express"))
  .catch((err) => console.error("Error while connecting Server: ", err));

module.exports = pool;
