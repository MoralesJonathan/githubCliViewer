app.controller('mainController', ['$scope', 'http',  function ($scope, http) {
    $scope.title = "Github CLI Viewer",
    $scope.loader = false,
    $scope.url = '',
        $scope.submit = function (url) {
        $scope.loader = true;
        http(url).then(function (result) {
            alert(result.data)
            $scope.loader = false;
        })
    };
}]);