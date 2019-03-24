const mysql = require('mysql');

db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'password',
  database: 'govtech'
});

// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  // console.log('Connected to database');
});
global.db = db;

// exports.db = db;