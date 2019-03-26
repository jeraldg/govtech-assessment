const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  port: process.env.port,
  password: process.env.password,
  database: 'govtech_assessment'
});

db.connect((err) => {
  if (err) {
    throw "Mysql connection error";
  }
});

global.db = db;
