import 'dotenv/config';
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => console.log('Running my app', process.env.MY_SECRET));
