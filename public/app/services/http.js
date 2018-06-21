app.factory('http', ['$http', function ($http) {
    return $http.post('/api/uploadUrl')
        .then(function (data) {
            return data;
        }, function (err) {
            return err;
        });
}]);
