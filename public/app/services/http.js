app.factory('http', ['$http', function ($http) {
    return function (url) {
        return $http.post('/api/uploadUrl', { url: url })
            .then(function (data) {
                return data;
            }, function (err) {
                return err;
            });
    }
}]);
