require('dotenv').config(); // Load environment variables

const express = require('express');
const { MongoClient } = require('mongodb');
const { Client } = require('pg');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;

//app.use('/static', express.static('public/static'));

// Set Handlebars as the view engine
app.set('views', path.join(__dirname, '../views')); // adjust path to the views folder
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

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
      {name: 'Dynamic app that queries relational and non-relational databses'}
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

app.listen(port, () => console.log(`Server running on port ${port}`));
