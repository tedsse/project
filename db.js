// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'db_register'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

module.exports = db;
