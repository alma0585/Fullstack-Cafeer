// ------------------- Server setup ------------------ //

const express = require('express');
const cors = require('cors');
const db = require('mysql2');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// ------------------- Database connection setup ------------------ //
const connection = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'susgaard',
    database: 'cafe_db'
});

// -------------------------- Start server ----------------------------//
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// --------------------- Endpoint to see all cafes -----------------------//
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

// ----------------- Endpoint for adding a new cafe (POST /cafes/new) -----------//
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

// ------------------------- Endpoint to see all users -----------------------//
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


//----------------------- Create endpoint for unique cafeid ----------------- //
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

// -----------------------Endpoint to see specific cafe------------//
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

// ----------- Query parameter to find cafes with a higher rating than the parameter ---------//
app.get('/cafes/rating', (req, res) => {
    const { rating } = req.query
    // use parseFloat instead of parseInt, as parseInt truncates to an integer (we also need decimal values)
    const parsedRating = parseFloat(rating)
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

//-------- Endpoint to find cafes in specific price range, can also search for multiple price_ranges-----//
app.get('/cafes/price', (req, res) => {
    const { price_range } = req.query
    if (!price_range) {
        return res.status(500).send('Invalid price range input')
    }
    const multiplePriceRange = price_range.split(",")
    const query = 'SELECT * FROM cafes WHERE price_range IN (?)'
    connection.query(query, [multiplePriceRange], (error, results) => {
        if (error) {
            console.error('Error fetching cafes within specific price range: ', error)
            return res.status(400).send('Database query error')
        }
        if (results.length === 0) {
            return res.status(404).send(`Please enter a valid price range`)
        }
        res.send(results)
        console.log(multiplePriceRange)
    });
});

// ------------------------ Create endpoint to filter cafes by size ---------------//
app.get('/cafes/size', (req, res) => {
    const { size } = req.query
    if (!size) {
        return res.status(500).send('Invalid size')
    }
    const multipleSizes = size.split(",")
    const query = 'SELECT * FROM cafes WHERE size IN (?)'
    connection.query(query, [multipleSizes], (error, results) => {
        if (error) {
            console.error('Error fetching cafes within specific price range: ', error)
            return res.status(400).send('Database query error')
        }
        if (results.length === 0) {
            return res.status(404).send(`Use a valid size`)
        }
        res.send(results)
        console.log(multipleSizes)
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

// ----------------- Check if username is in users table to be able to push into cafe table  ---------------------//
// Endpoint to check if a username exists in the users table
app.get('/users/check', (req, res) => {
    const { username } = req.query;
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (error, results) => {
        if (results.length > 0) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ exists: false });
        }
    });
});

