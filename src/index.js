// THIS VERSION WORKS SO RETURN HERE IF NEEDED
// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// app.get('/app', (req, res) => {
//   res.send('This is a dynamic route!');
// });

// app.listen(port, () => console.log('Running my app'));

// TESTING DOTENV
// require('dotenv').config();
// console.log("Postgres URI:", process.env.POSTGRES_URI);
// console.log("Mongo URI:", process.env.MONGO_URI);

// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// app.get('/app', (req, res) => {
//   res.send('This is a dynamic route!');
// });

// app.listen(port, () => console.log('Running my app'));


// NEW VERSION INCLUDING BOTH DATABASE CONNECTIONS
// PostgreSQL connection
// require('dotenv').config(); // Load environment variables
// const express = require('express');
// const { MongoClient } = require('mongodb');
// const { Client } = require('pg');

// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// Debugging: Log environment variables
// console.log("Mongo URI:", process.env.MONGO_URI);
// console.log("Postgres URI:", process.env.POSTGRES_URI);

// // PostgreSQL connection
// const pgClient = new Client({ connectionString: process.env.POSTGRES_URI });

// pgClient.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch(err => console.error('PostgreSQL error:', err));

// // MongoDB connection
// if (!process.env.MONGO_URI) {
//   console.error("❌ MONGO_URI is missing!");
//   process.exit(1); // Exit if no MongoDB URI
// }

// const mongoClient = new MongoClient(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// async function connectMongo() {
//   try {
//     await mongoClient.connect();
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     console.error('MongoDB error:', err);
//   }
// }

// connectMongo();

// app.get('/app', (req, res) => {
//   res.send('This is testing for dynamic routes');
// });

// // PostgreSQL Route: Get all users
// app.get('/users', async (req, res) => {
//   try {
//     const result = await pgClient.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('PostgreSQL query error:', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // MongoDB Route: Get all logs
// app.get('/logs', async (req, res) => {
//   try {
//     const db = mongoClient.db('my_mongo_db'); // Change to your actual DB name
//     const logs = await db.collection('logs').find().toArray();
//     res.json(logs);
//   } catch (err) {
//     console.error('MongoDB query error:', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// app.listen(port, () => console.log(`Running my app on port ${port}`));

require('dotenv').config(); // Load environment variables

const express = require('express');
const { MongoClient } = require('mongodb');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(express.static('public'));

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
app.get('/app', (req, res) => res.send('This is testing for dynamic routes'));

// PostgreSQL: Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pgClient.query('SELECT * FROM users');
    res.json(result.rows);
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
