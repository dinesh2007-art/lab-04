const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Constant secret key for Lab 4 (will move to .env in Lab 8)
const JWT_SECRET = 'aurora_bdf_lab04_super_secret_key';
const PORT = 3000;

let db;

// Initialize SQLite database and create users table
async function initializeDBAndServer() {
  try {
    db = await open({
      filename: './users.db',
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
}

initializeDBAndServer();

// 1. POST /register/ - Register a new user
app.post('/register/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ error: 'Username, name, and password are required' });
  }

  try {
    // Check if username already exists (Parameterised query)
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password with bcrypt (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into DB
    await db.run(
      'INSERT INTO users (username, name, password) VALUES (?, ?, ?)',
      [username, name, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. POST /login/ - Authenticate user and return JWT
app.post('/login/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Fetch user from DB
    const dbUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!dbUser) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    // Compare plain password with stored hash
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT containing ONLY the username
    const payload = { username: dbUser.username };
    const jwt_token = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({ jwt_token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});