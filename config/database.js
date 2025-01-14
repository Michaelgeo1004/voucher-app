const sql = require("mssql");
require("dotenv").config()

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to Sql Server Express");
    return pool;
  })
  .catch((err) => console.error("Error while connecting Server: ", err));

module.exports = poolPromise;
