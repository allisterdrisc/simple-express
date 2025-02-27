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

require('dotenv').config(); // loads variables from .env
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
    console.log('Connected to MongoDB'); // Log MongoDB connection success
  })
  .catch(err => {
    console.error('MongoDB connection error', err.stack); // Log MongoDB connection error
    process.exit(1); // Exit the process with an error code
  });

// Connect to PostgreSQL
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL'); // This should appear in pm2 logs if successful
    // Start the server after successful PostgreSQL connection
    app.listen(port, () => console.log(`App running on port ${port}`));
  })
  .catch(err => {
    console.error('PostgreSQL connection error', err.stack); // Log PostgreSQL connection error
    process.exit(1); // Exit the process with an error code
  });

// Define routes
app.get('/app', (req, res) => {
  res.send('This is a dynamic route!');
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});


// ATTEMPT 3

// require('dotenv').config(); // loads variables from .env
// const { Client } = require('pg');
// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// // Setup MongoDB client
// const mongoose = require('mongoose');

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => {
//     console.log('Connected to MongoDB'); // Log MongoDB connection success
//     // After MongoDB is connected, you can start your Express app
//     app.listen(port, () => {
//       console.log(`App running on port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.error('MongoDB connection error', err.stack); // Log MongoDB connection error
//     process.exit(1); // Exit the process with an error code
//   });

// // Setup PostgreSQL client
// const { Client } = require('pg');
// const client = new Client({
//   host: 'localhost', // or your droplet's IP
//   user: 'allister',
//   password: 'Penny',
//   database: 'allister',
//   port: 5432
// });

// // Connect to PostgreSQL
// client.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL'); // Log PostgreSQL connection success
//     // The server is started after PostgreSQL connection is successful
//     // No need to listen to the port here, it's already handled by MongoDB
//   })
//   .catch(err => {
//     console.error('PostgreSQL connection error', err.stack); // Log PostgreSQL connection error
//     process.exit(1); // Exit the process with an error code
//   });

