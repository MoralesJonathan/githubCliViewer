const express = require('express'),
app = express(),
fs = require('fs'),
PORT = process.env.PORT || 8080,
bodyParser = require('body-parser'),
routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(routes);

app.listen(PORT, function() {
  console.log('Listening on port: ' + PORT);
});