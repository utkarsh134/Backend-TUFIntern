const mysql = require("mysql");

const mysqlConnect = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: `${process.env.DB_PASSWORD}`,
  database: "submissionsdb",
});

mysqlConnect.connect((err, res) => {
  if (err) console.error(err.message);
  else console.log("MySQL database connected successfully");
});

module.exports = mysqlConnect;
