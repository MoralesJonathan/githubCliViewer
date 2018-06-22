app.controller('mainController', ['$scope', 'http', 'socket', function ($scope, http, socket) {
    $scope.title = "Github CLI Viewer";
    $scope.loader = false;
    $scope.loadingMessage = 'Hi!';
    $scope.url = '';
    $scope.bodyView = "../views/search.html";
    $scope.terminalLines = [];
    $scope.terminal;
    $scope.inputString = '';
    $scope.isExpanded = false;
    $scope.isMinified = false;
    $scope.terminalInput = function (key) {
        if (key.which === 13) {
            http($scope.terminal, 'sendInput/' + $scope.inputString).then(function () {
                $scope.inputString = '';
            })
        }
    };
    $scope.submit = function (url) {
        console.log("WHYY")
        $scope.loader = true;
        $scope.loadingMessage = 'Downloading Repository...'
        http(url, 'uploadUrl').then(function (body) {
            if (body.status != 500) {
                $scope.loader = false;
                $scope.bodyView = "../views/terminal.html";
                http(body.data, 'startNode').then(function (terminalInstance) {
                    $scope.terminal = terminalInstance;
                })
            }
        })
    };
    $scope.reqRoom = function () {
        http('', 'newRoom').then(function (body) {
            socket.emit('joinRoom', body.data);
        })
    };
    $scope.expandTerm = function () {
        if ($scope.isMinified) $scope.isMinified = !$scope.isMinified;
        $scope.isExpanded = !$scope.isExpanded;
    };
    $scope.hideTerm = function () {
        $scope.isMinified = !$scope.isMinified;
    };
    $scope.refresh = function () {
        location.reload();
    };
    socket.on('uploadProgress', function (msg) {
        $scope.loadingMessage = msg
    });
    socket.on('terminalMessage', function (msg) {
        $scope.terminalLines.push(msg)
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


