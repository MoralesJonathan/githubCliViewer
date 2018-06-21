const express = require('express'),
app = express(),
fs = require('fs'),
PORT = process.env.PORT || 8080,
spawn = require('child_process').spawn,
routes = require('./routes');

app.use(express.static('public'));

app.use(routes);

app.listen(PORT, function() {
  console.log('Listening on port: ' + PORT);
});