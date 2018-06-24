const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    PORT = process.env.PORT || 8080,
    bodyParser = require('body-parser'),
    session = require('express-session'),
    routes = require('./routes'),
    socketController = require('./controllers/socket.js');
io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));
app.use(routes);

io.on('connection', socketController.connect);


server.listen(PORT, () => {
    console.log(`Listening on port:  ${PORT}`);
});