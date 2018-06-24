app.controller('mainController', ['$scope', 'http', 'socket', function ($scope, http, socket) {
    $scope.title = "Github CLI Viewer";
    $scope.loader = false;
    $scope.bodyView = "../views/search.html";
    $scope.submit = function (url) {
        if (!url) {
            $scope.validate = "invalid";
            $scope.urlError = "Please enter valid github url";
        } else {
            $scope.validate = "valid";
            $scope.loader = true;
            $scope.loadingMessage = 'Downloading Repository...';
            http(url, 'uploadUrl').then(function (body) {
                if (body.status === 200) {
                    $scope.loader = false;
                    $scope.bodyView = "../views/terminal.html";
                    http(body.data, 'startNode').then(function (terminalInstance) {
                        $scope.terminal = terminalInstance;
                        socket.emit('spawnProc', terminalInstance);
                    });
                } else {
                    alert("Oops! An unexpected error occured. Please try again later.");
                    locaton.reload();
                }
            });
        }
    };
    $scope.reqRoom = function () {
        http('', 'newRoom').then(function (body) {
            socket.emit('joinRoom', body.data);
        });
    };
    $scope.refresh = function () {
        location.reload();
    };
}]);


