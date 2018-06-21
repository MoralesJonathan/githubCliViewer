app.controller('mainController', ['$scope', 'http',  function ($scope, http) {
    $scope.title = "Hello World!",
    $scope.submit = function (url) {
    http.then(function (result) {
        //Do something
    })
    };
}]);