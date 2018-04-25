angular.module('app').factory('logsService', ['$rootScope', '$http', logsService]);

function logsService(r, h) {
    var service = {
        get: get
    };
    return service;

    function get() {
        return h.post(apiRoute + '/api/').then(function(resp) {
            return resp.data;
        });
    }

}