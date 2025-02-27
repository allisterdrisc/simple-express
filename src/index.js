const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/app', (req, res) => {
  res.send('This is a dynamic route!');
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

app.listen(port, () => console.log('Running my app'));