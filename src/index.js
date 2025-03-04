require('dotenv').config(); // Load environment variables

const express = require('express');
const { MongoClient } = require('mongodb');
const { Client } = require('pg');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

// Set Handlebars as the view engine
app.set('views', path.join(__dirname, '../views')); // adjust path to the views folder
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// set up body parsing middleware to be able to use post etc
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Validate environment variables
const { MONGO_URI, POSTGRES_URI } = process.env;
if (!MONGO_URI || !POSTGRES_URI) {
  console.error("Missing environment variables: Ensure MONGO_URI and POSTGRES_URI are set.");
  process.exit(1);
}

// PostgreSQL connection
const pgClient = new Client({ connectionString: POSTGRES_URI });

async function connectPostgres() {
  try {
    await pgClient.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  }
}

connectPostgres();

// MongoDB connection
const mongoClient = new MongoClient(MONGO_URI);

async function connectMongo() {
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

connectMongo();

// Routes
app.get('/', (req, res) => {
  const testData = {
    title: 'Links',
    list: [
      {name: 'Static asset'},
      {name: 'Interact with databases'}
    ]
  };

  res.render('home', testData);
});

// PostgreSQL: Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pgClient.query('SELECT * FROM users');
    const users = result.rows;
    res.render('users', { users });
  } catch (err) {
    console.error('PostgreSQL query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PostgreSQL: Add a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body; // Assuming these fields exist in your form
  try {
    await pgClient.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.redirect('/users'); // Redirect back to the user list
  } catch (err) {
    console.error('PostgreSQL insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PostgreSQL: Update an existing user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body; // Assuming these fields are in your form
  try {
    await pgClient.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    res.redirect('/users'); // Redirect back to the user list
  } catch (err) {
    console.error('PostgreSQL update error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PostgreSQL: Delete a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pgClient.query('DELETE FROM users WHERE id = $1', [id]);
    res.redirect('/users'); // Redirect back to the user list
  } catch (err) {
    console.error('PostgreSQL delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// MongoDB: Get all logs
app.get('/logs', async (req, res) => {
  try {
    const db = mongoClient.db('my_mongo_db'); // Change to your actual DB name
    const logs = await db.collection('logs').find().toArray();
    res.json(logs);
  } catch (err) {
    console.error('MongoDB query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// MongoDB: Add a new log
app.post('/logs', async (req, res) => {
  const { logMessage } = req.body; // Assuming you are sending a 'logMessage'
  try {
    const db = mongoClient.db('my_mongo_db');
    await db.collection('logs').insertOne({ log: logMessage, timestamp: new Date() });
    res.redirect('/logs'); // Redirect back to the logs list
  } catch (err) {
    console.error('MongoDB insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// MongoDB: Update an existing log
app.put('/logs/:id', async (req, res) => {
  const { id } = req.params;
  const { logMessage } = req.body; // Assuming you are sending a 'logMessage'
  try {
    const db = mongoClient.db('my_mongo_db');
    await db.collection('logs').updateOne(
      { _id: new mongoClient.ObjectId(id) },
      { $set: { log: logMessage, timestamp: new Date() } }
    );
    res.redirect('/logs'); // Redirect back to the logs list
  } catch (err) {
    console.error('MongoDB update error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// MongoDB: Delete a log
app.delete('/logs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = mongoClient.db('my_mongo_db');
    await db.collection('logs').deleteOne({ _id: new mongoClient.ObjectId(id) });
    res.redirect('/logs'); // Redirect back to the logs list
  } catch (err) {
    console.error('MongoDB delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
