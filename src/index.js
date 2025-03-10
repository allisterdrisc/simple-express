require('dotenv').config(); // Load environment variables

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { Client } = require('pg');
const path = require('path');
const { engine } = require('express-handlebars');


const app = express();
const port = 3000;

// Set Handlebars as the view engine
app.set('views', path.join(__dirname, '../views')); // adjust path to the views folder
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// set up body parsing middleware to be able to use post, delete, put
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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
  const { name, email } = req.body;
  try {
    await pgClient.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.redirect('/users');
  } catch (err) {
    console.error('PostgreSQL insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/users/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pgClient.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = result.rows[0];
    res.render('editUser', { user });
  } catch (err) {
    console.error('PostgreSQL query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PostgreSQL: Update an existing user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await pgClient.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    res.redirect('/users');
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
    res.redirect('/users');
  } catch (err) {
    console.error('PostgreSQL delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// MongoDB: Get all logs
app.get('/logs', async (req, res) => {
  try {
    const db = mongoClient.db('my_mongo_db');
    const logs = await db.collection('logs').find().toArray();
    res.render('logs', { logs });
  } catch (err) {
    console.error('MongoDB query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// MongoDB: Add a new log
app.post('/logs', async (req, res) => {
  const { logMessage } = req.body;
  try {
    const db = mongoClient.db('my_mongo_db');
    await db.collection('logs').insertOne({ log: logMessage, timestamp: new Date() });
    res.redirect('/logs');
  } catch (err) {
    console.error('MongoDB insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get log by id to edit
app.get('/logs/:id/edit', async (req, res) => {
  const { id } = req.params;
  console.log(`Editing log with ID: ${id}`); // Log for debugging

  try {
    const db = mongoClient.db('my_mongo_db');
    const objectId = new ObjectId(id);
    const log = await db.collection('logs').findOne({ _id: objectId });

    if (!log) {
      return res.status(404).send('Log not found');
    }

    res.render('editLog', { log });
  } catch (err) {
    console.error('MongoDB query error:', err);
    res.status(500).send('Database error');
  }
});

// MongoDB: Update an existing log
app.put('/logs/:id', async (req, res) => {
  const { id } = req.params;
  const { logMessage } = req.body;

  try {
    const db = mongoClient.db('my_mongo_db');
    await db.collection('logs').updateOne(
      { _id: new ObjectId(id) },
      { $set: { log: logMessage, timestamp: new Date() } }
    );
    res.redirect('/logs');
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
    await db.collection('logs').deleteOne({ _id: new ObjectId(id) });
    res.redirect('/logs'); // Redirect back to the logs list
  } catch (err) {
    console.error('MongoDB delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
