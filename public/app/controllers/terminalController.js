app.controller('terminalController', ['$scope', 'http', 'socket', '$timeout', function ($scope, http, socket, $timeout) {
    $scope.isExpanded = false;
    $scope.isMinified = false;
    $scope.terminalInput = function (key) {
        $timeout(function () {
            key.which === 13 ? (
                http([$scope.inputString, $scope.terminal], 'sendInput/U+E007').then(function () { }),
                $scope.inputString = ''
            ) : key.which === 8 ? http([null, $scope.terminal], 'sendInput/U+0008').then(function () { }) : http([null, $scope.terminal], `sendInput/${$scope.inputString[$scope.inputString.length - 1]}`).then(function () { });
        });
    };
    $scope.expandTerm = function () {
        if ($scope.isMinified) $scope.isMinified = !$scope.isMinified;
        $scope.isExpanded = !$scope.isExpanded;
    };
    $scope.hideTerm = function () {
        $scope.isMinified = !$scope.isMinified;
    };
}]);