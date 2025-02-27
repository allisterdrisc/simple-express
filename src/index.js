// require('dotenv').config(); // loads variables from .env
// const { Client } = require('pg');
// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// // const client = new Client({
// //   connectionString: process.env.POSTGRES_URI,
// // });

// const client = new Client({
//   host: 'localhost', // or your droplet's IP
//   user: 'your_postgres_user',
//   password: 'your_postgres_password',
//   database: 'your_postgres_database',
//   port: 5432 
// });

// client.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch(err => console.error('Connection error', err.stack));

// app.get('/app', (req, res) => {
//   res.send('This is a dynamic route!');
// });

// app.get('/test', (req, res) => {
//   res.send('Test route is working!');
// });

// app.listen(port, () => console.log('Running my app'));

require('dotenv').config(); // loads variables from .env
const { Client } = require('pg');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Setup PostgreSQL client
const client = new Client({
  host: 'localhost', // or your droplet's IP
  user: 'allister',
  password: 'Penny',
  database: 'allister',
  port: 5432
});

// Connect to PostgreSQL
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL'); // This should appear in pm2 logs if successful
    // Start the server after successful PostgreSQL connection
    app.listen(port, () => console.log('Running my app'));
  })
  .catch(err => {
    console.error('Connection error', err.stack); // Log PostgreSQL connection error
    process.exit(1); // Exit the process with an error code
  });

// Define routes
app.get('/app', (req, res) => {
  res.send('This is a dynamic route!');
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});
