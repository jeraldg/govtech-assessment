const express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); 

app.post('/api/register', (req, res) => {
  const { students, teacher} = req.body;

  if (!students || !teacher) return;

  res.sendStatus(204);
});

app.listen(process.env.PORT || 3000)