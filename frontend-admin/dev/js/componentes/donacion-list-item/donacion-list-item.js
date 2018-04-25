angular.module('app')
.component('donacionListItem', {
	templateUrl: './components/donacion-list-item.html',
	//transclude: true,
	bindings: {
		donacion: '<'
	},
	controller: function() {
	    
	    var vm = this;

	    this.$onInit = function() {
	      this.uniqueId = String(performance.now()).replace('.','');
	    };
	  }
});