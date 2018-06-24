app.controller('socketController', ['$scope', 'socket', function ($scope, socket) {
    $scope.terminalLines = [];
    socket.on('uploadProgress', function (msg) {
        $scope.loadingMessage = msg;
    });
    socket.on('terminalMessage', function (msg) {
        $scope.terminalLines.push(msg);
        $scope.inputString = '';
        if (document.getElementById("terminalView")) document.getElementById("terminalView").scrollTop = document.getElementById("terminalView").scrollHeight;
    });
    socket.on('terminalEnd', function (room) {
        angular.element(document.querySelector('#termUserInput')).remove();
        socket.emit('leaveRoom', room);
    });
    socket.on('error', function (msg) {
        $scope.bodyView = "../views/error.html";
        $scope.errorMessage = msg;
    });
}]);


