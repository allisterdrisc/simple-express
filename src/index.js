const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/app', (res) => {
  res.send('This is a dynamic route!');
});

app.listen(port, () => console.log('Running my app'));
