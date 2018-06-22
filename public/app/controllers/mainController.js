app.controller('mainController', ['$scope', 'http', 'socket', function ($scope, http, socket) {
    $scope.title = "Github CLI Viewer";
    $scope.loader = false;
    $scope.loadingMessage = 'Hi!';
    $scope.url = '';
    $scope.bodyView = "../views/search.html";
    $scope.terminalLines = [];
    $scope.terminal;
    $scope.inputString = '';
    $scope.terminalInput = function (key) {
        if (key.which === 13) {
            http($scope.terminal, 'sendInput/' + $scope.inputString).then(function () {
                $scope.inputString = '';
            })
        }
    };
    $scope.submit = function (url) {
        $scope.loader = true;
        $scope.loadingMessage = 'Downloading Repository...'
        http(url, 'uploadUrl').then(function (body) {
            $scope.loader = false;
            $scope.bodyView = "../views/terminal.html";
            http(body.data, 'startNode').then(function (terminalInstance) {
                $scope.terminal = terminalInstance;
            })
        })
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
    socket.on('terminalEnd', function (msg) {
        angular.element(document.querySelector('#termUserInput')).remove();
    });
    socket.on('error', function (msg) {
        $scope.bodyView = "../views/error.html";
        $scope.errorMessage = msg;
    });
}]);


