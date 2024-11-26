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
    password: 'root',
    database: 'cafe_db'
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// ---------------------------- Endpoint to see all cafees and their info---------------------------------------//
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

// ------------------------ Endpoint to see all restaurant only by names---------------------------------//


app.get('/cafes/names', (req, res) => {
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
app.post('/cafes/new', (req, res) => {
    const { name, location, rating, description } = req.body;

    if (!name || !location || !rating || !description) {
        return res.status(400).send('Missing name or location');
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

// Create endpoint for unique cafeid
app.get('/cafes/id/:id', (req, res) => {
    const cafeId = req.params.id
    if (isNaN(cafeId)) {
        return res.status(400).send('Invalid cafe ID')
    }
    const query = 'SELECT name FROM cafes WHERE cafe_id = ?';
    connection.query(query, [cafeId] ,(error, results) => {
        if (error) {
            console.error('Error fetching unique Cafe:', error);
            return res.status(500).send('Database query error');
            // Check if the returned array object is larger than 0 (meaning it's empty)
        } if (results.length === 0) {
            return res.status(404).send('Cafe with this Unique ID does not exist.')
        }
        res.send(results);
    });
});

// Endpoint to see specific cafe
app.get('/cafes/name/:name', (req, res) => {
    const queryParams = req.params.name;
    const query = 'SELECT * FROM cafes WHERE name = ?'; // Assuming your table is named `cafes`
    connection.query(query, [queryParams], (error, results) => {
        if (error) {
            console.error('Error fetching cafe by name:', error);
            return res.status(500).send('Database query error');
        }
        res.send(results);
    });
});

// Create query parameter to filter by cafe rating (not working yet)
app.get('/cafes/rating', (req, res) => {
    const { rating } = req.query
    const parsedRating = parseInt(rating)
    if (!isNaN(parsedRating)) {
        const query = 'SELECT * FROM cafes WHERE rating >= ?'
        connection.query(query, [parsedRating], (error, results) => {
            if (error) {
                console.error('Error fetching rating lower than provided parameter: ', error)
                return res.status(500).send('Database query error')
            }
            res.send(results)
        });
    } else {
        res.status(400).send('Invalid rating parameter')
    }
});

// Fallback for unmatched routes (ChatGpt svar)
app.use('*', (req, res) => {
    res.sendStatus(404);
});







