angular.module('app').factory('usuariosService', ['$rootScope', '$http', usuariosService]);

function usuariosService(r, h) {
    var service = {
        getAll: getAll,
		create: create,
		remove: remove,
		update: update
    };
    return service;

    function getAll() {
        return h.get(apiRoute + '/api/users/').then(function(resp) {
            return resp.data;
        });
    }
    function create(o) {
        return h.post(apiRoute + '/api/users/',o).then(function(resp) {
            return resp.data;
        });
    }
    function remove(o) {
        return h.delete(apiRoute + '/api/users/'+o.id).then(function(resp) {
            return resp.data;
        });
    }
    function update(o) {
        return h.put(apiRoute + '/api/users/',o).then(function(resp) {
            return resp.data;
        });
    }

    }