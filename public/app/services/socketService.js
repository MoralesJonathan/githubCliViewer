app.service('socket', ['socketFactory', function socket(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('http://localhost:8080')
    });
}]);