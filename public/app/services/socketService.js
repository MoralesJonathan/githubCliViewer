app.service('socket', ['socketFactory', function socket(socketFactory) {
    return socketFactory({});
}]);