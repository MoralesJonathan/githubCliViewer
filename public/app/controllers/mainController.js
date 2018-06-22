app.controller('mainController', ['$scope', 'http', 'socket', function ($scope, http, socket) {
    $scope.title = "Github CLI Viewer",
    $scope.loader = false,
    $scope.loadingMessage = 'Hi!',
    $scope.url = '',
    $scope.bodyView = "../views/search.html",
    $scope.terminalLines = []
    $scope.submit = function (url) {
        $scope.loader = true;
        $scope.loadingMessage = 'Downloading Repository...'
        http(url).then(function (result) {
            $scope.loader = false;
            $scope.bodyView = "../views/terminal.html"
        })
    };
    socket.on('uploadProgress', function (msg) {
        $scope.loadingMessage = msg
    });
    socket.on('terminalMessage', function (msg) {
        $scope.terminalLines.push(msg)
    });
}]);


