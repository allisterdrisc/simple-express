// require('dotenv').config(); // loads variables from .env
// const { Client } = require('pg');
// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// // Setup PostgreSQL client
// const client = new Client({
//   host: 'localhost', // or your droplet's IP
//   user: 'allister',
//   password: 'Penny',
//   database: 'allister',
//   port: 5432
// });

// const mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost/your_mongodb_database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Connect to PostgreSQL
// client.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL'); // This should appear in pm2 logs if successful
//     // Start the server after successful PostgreSQL connection
//     app.listen(port, () => console.log('Running my app'));
//   })
//   .catch(err => {
//     console.error('Connection error', err.stack); // Log PostgreSQL connection error
//     process.exit(1); // Exit the process with an error code
//   });

// // Define routes
// app.get('/app', (req, res) => {
//   res.send('This is a dynamic route!');
// });

// app.get('/test', (req, res) => {
//   res.send('Test route is working!');
// });


// ATTEMPT 2

// require('dotenv').config(); // loads variables from .env
// console.log('MONGO_URI:', process.env.MONGO_URI);

// const { Client } = require('pg');
// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// // Setup PostgreSQL client
// const client = new Client({
//   host: 'localhost', // or your droplet's IP
//   user: 'allister',
//   password: 'Penny',
//   database: 'allister',
//   port: 5432
// });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => {
//     console.log('Connected to MongoDB'); // Log MongoDB connection success
//   })
//   .catch(err => {
//     console.error('MongoDB connection error', err.stack); // Log MongoDB connection error
//     process.exit(1); // Exit the process with an error code
//   });

// // Connect to PostgreSQL
// client.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL'); // This should appear in pm2 logs if successful
//     // Start the server after successful PostgreSQL connection
//     app.listen(port, () => console.log(`App running on port ${port}`));
//   })
//   .catch(err => {
//     console.error('PostgreSQL connection error', err.stack); // Log PostgreSQL connection error
//     process.exit(1); // Exit the process with an error code
//   });

// // Define routes
// app.get('/app', (req, res) => {
//   res.send('This is a dynamic route!');
// });

// app.get('/test', (req, res) => {
//   res.send('Test route is working!');
// });


// ATTEMPT 3
require('dotenv').config(); // Load environment variables from .env file

// Log all environment variables to verify MONGO_URI
console.log('Environment variables:', process.env);

// Check if MONGO_URI is available
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set in the .env file');
  process.exit(1); // Exit if MongoDB URI is not set
}

console.log('MONGO_URI:', process.env.MONGO_URI);

const { Client } = require('pg');
const express = require('express');
const mongoose = require('mongoose');
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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error', err.stack);
    process.exit(1); // Exit the process with an error code
  });

// Connect to PostgreSQL
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    app.listen(port, () => console.log(`App running on port ${port}`));
  })
  .catch(err => {
    console.error('PostgreSQL connection error', err.stack);
    process.exit(1); // Exit the process with an error code
  });

// Define routes
app.get('/app', (req, res) => {
  res.send('This is a dynamic route!');
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});
