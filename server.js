const app = require('express')()
fs = require('fs')
PORT = process.env.PORT || 8080
spawn = require('child_process').spawn;


app.listen(PORT, function() {
  console.log('Listening on port: ' + PORT);
});