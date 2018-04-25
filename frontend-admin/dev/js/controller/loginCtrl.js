angular.module('app').controller('loginCtrl',['$scope', '$rootScope', 'loginService','$state','jwtHelper', loginCtrl]);

function loginCtrl(s, r, loginService,state,jwtHelper){

	var vm = this;
	r.hideNav = true;
  
  vm.login = function() {
      r.hideNav = false;
      loginService.login(vm.credenciales).then(function(data){
    	  localStorage.setItem('id_token',data.jwt);
        r.user = jwtHelper.decodeToken(data.jwt).user;
        r.user.responsable = true;
    	  state.go('app');
      });
  };

}