app.controller('mainController', ['$scope', 'http', 'socket', '$timeout', function ($scope, http, socket, $timeout) {
    $scope.title = "Github CLI Viewer";
    $scope.loader = false;
    $scope.loadingMessage = '';
    $scope.url = '';
    $scope.bodyView = "../views/search.html";
    $scope.terminalLines = [];
    $scope.terminal;
    $scope.validate;
    $scope.inputString = '';
    $scope.isExpanded = false;
    $scope.isMinified = false;
    $scope.terminalInput = function (key) {
        $timeout(function () {
            key.which === 13 ? (
                $scope.terminalLines.push($scope.inputString ),
                http($scope.terminal, 'sendInput/' + 'U+E007').then(function () { }),
                $scope.inputString = ''
            ) : key.which === 8 ? http($scope.terminal, 'sendInput/' + 'U+0008').then(function () { }) : http($scope.terminal, 'sendInput/' + $scope.inputString[$scope.inputString.length - 1]).then(function () { })
        })
    };
    $scope.submit = function (url) {
        !url ? (
            $scope.validate = "invalid",
            $scope.urlError = "Please enter valid github url"
            ): (
            $scope.validate = "valid", 
            $scope.urlError="",
            $scope.loader = true,
            $scope.loadingMessage = 'Downloading Repository...',
            http(url, 'uploadUrl').then(function (body) {
                if (body.status != 500) {
                    $scope.loader = false;
                    $scope.bodyView = "../views/terminal.html";
                    http(body.data, 'startNode').then(function (terminalInstance) {
                        $scope.terminal = terminalInstance;
                        socket.emit('spawnProc', terminalInstance);
                    })
                }
            })
        )
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
        $scope.loadingMessage = msg;
    });
    socket.on('terminalMessage', function (msg) {
        $scope.terminalLines.push(msg);
        $scope.inputString = ''
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


