const sql = require("mssql");

const dbConfig = {
  user: "GIO",
  password: "GIO8899",
  server: "localhost",
  database: "voucher_db",
  options: {
    encrypt: false,
    enableArithAbort: true,
  }
};

const pool = new sql.ConnectionPool(dbConfig);

pool
  .connect()
  .then(() => console.log("COnnected to Sql Server Express"))
  .catch((err) => console.error("Error while connecting Server: ", err));

module.exports = pool;
