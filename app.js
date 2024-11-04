// index.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// Set views directory (if your views are in a folder named 'views' in the root directory)
app.set('views', path.join(__dirname, 'views'));
// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('home'));

// Load About page with JSON data
app.get('/about', (req, res) => {
    const aboutPath = path.join(__dirname, '/data/about.json');
    fs.readFile(aboutPath, 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading JSON file", err);
        return res.status(500).send("Server error");
      }
  
      const aboutData = JSON.parse(data); // Parse JSON data
      res.render('about', { data: aboutData });
    });
  });

app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

// Register route
app.post('/register', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.render('register', { errors: errors.array() });
  }

  const { name, username, email, password } = req.body;
  console.log("Form data:", req.body);
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("Hashed password:", hashedPassword);

  const query = 'INSERT INTO registers (name, username, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name, username, email, hashedPassword], (err, result) => {
    if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).send("Server error");
      }
    console.log("User registered successfully with ID:", result.insertId);
    res.redirect('/login');
  });
});

// Login route
app.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', { errors: errors.array() });
  }

  const { username, email, password } = req.body;

  db.query('SELECT * FROM registers WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.render('login', { errors: [{ msg: 'Invalid credentials' }] });
    }

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.render('login', { errors: [{ msg: 'Invalid credentials' }] });
    }

    res.redirect('/');
  });
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
