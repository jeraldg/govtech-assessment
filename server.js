const express = require('express');

var app = express();

app.get('/', (req, res) => {
  res.send('Hello Express')
});

app.listen(process.env.PORT || 3000)