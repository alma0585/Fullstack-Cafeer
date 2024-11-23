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

// ---------------------------- Endpoint to see all cafees and their info---------------------------------------//
app.get('/cafe', (req, res) => {
    const query = 'SELECT * FROM cafes';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).send('Database query error');
        }
        res.json(results);
    });
});

// ---------------------------- Endpoint to see specific restaurant---------------------------------//

app.get('/cafe/:name', (req, res) => {
    const speedUserRequest = req.params.name;
    const query = 'SELECT * FROM cafes WHERE name = ?'; // Assuming your table is named `cafes`
    connection.query(query, [speedUserRequest], (error, results) => {
        if (error) {
            console.error('Error fetching cafe by name:', error);
            return res.status(500).send('Database query error');
        }
        res.send(results);
    });

});

// ------------------------ Endpoint to see all restaurant only by names---------------------------------//


app.get('/all/name', (req, res) => {
    const query = 'SELECT name FROM cafes'; // Assuming your table is named `cafes`
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching all names:', error);
            return res.status(500).send('Database query error');
        }
        res.send(results);
    });
});

// ----------------------- Endpoint for adding a new cafe (POST /new)-----------------------------//
app.post('/new', (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).send('Missing name or location');
    }

    const query = 'INSERT INTO cafes (name, location) VALUES (?, ?)';
    connection.query(query, [name, location], (error, results) => {
        if (error) {
            console.error('Error inserting cafe:', error);
            return res.status(500).send('Database insertion error');
        }
        res.status(201).json({ id: results.insertId, name, location });
    });
});

// -------------------------- Fallback for unmatched routes (ChatGpt svar) ---------------------------- //
app.use('*', (req, res) => {
    res.sendStatus(404);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

