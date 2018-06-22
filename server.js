const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    fs = require('fs'),
    PORT = process.env.PORT || 8080,
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    socketController = require('./controllers/socket.js');
io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(routes);

io.on('connection', socketController.connect);


server.listen(PORT, function() {
  console.log('Listening on port: ' + PORT);
});