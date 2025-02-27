const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

//app.listen(port, () => console.log('Running my app'));

app.listen(port, '0.0.0.0', () => {  // Ensuring it's bound to 0.0.0.0
  console.log('Server running on port 3000');
});