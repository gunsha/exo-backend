angular.module('app')
.factory('loginService', ['$rootScope','$http', loginService]);

function loginService(r,h) {
    var service = {
        login: login
    };
    return service;

    function login(cred) {  
      return h({method:'POST',url:apiRoute+'/api/users/login',data:cred,skipAuthorization: true}).then(function(resp){
      		return resp.data;
      });
    }
}