const express = require('express');
const cors = require('cors');
const db = require('mysql2');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Database connection setup
const connection = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'susgaard',
    database: 'cafe_db'
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// ---------------------------- Endpoint to see all cafes -----------------------
app.get('/cafes', (req, res) => {
    const query = 'SELECT * FROM cafes';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Database query error');
        }
        res.json(results);
    });
});

// ----------------------- Endpoint for adding a new cafe (POST /cafes/new) -----------
app.post('/cafes/new', (req, res) => {
    const { name, location, rating, description } = req.body;

    if (!name || !location || !rating || !description) {
        return res.status(400).send('Missing name, location, rating or description');
    }

    const query = 'INSERT INTO cafes (name, location, rating, description) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, location, rating, description], (error, results) => {
        if (error) {
            console.error('Error inserting cafe:', error);
            return res.status(500).send('Database insertion error');
        }
        res.status(201).json({ id: results.insertId, name, location, rating, description });
    });
});

// ---------------------------- Endpoint to see all users -----------------------
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Database query error');
        }
        res.json(results);
    });
});

// ----------------------- Endpoint for adding a new User (POST /users/new) --------------------
app.post('/users/new', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Missing username, email or password');
    }

    // ----------- Check if the username or email already exists ------------
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    connection.query(checkQuery, [username, email], (checkError, results) => {
        if (checkError) {
            console.error('Error checking for existing user:', checkError);
            return res.status(500).send('Database query error');
        }

        if (results.length > 0) {
            return res.status(409).send('Username or email already in use');
        }

        // ------------- Insert into table users -----------
        const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        connection.query(query, [username, email, password], (error, results) => {
            res.status(201).json({ id: results.insertId, username, email });
        });
    });
});
