// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || '34.128.66.32',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'L#.J:ySFyHN,&Fit',
    database: process.env.DB_NAME || 'db_register'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = db;