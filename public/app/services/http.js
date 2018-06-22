app.factory('http', ['$http', function ($http) {
    return function (param1, apiUrl) {
        return $http.post('/api/' + apiUrl, { data: param1 })
            .then(function (data) {
                return data;
            }, function (err) {
                return err;
            });
    }
}]);
