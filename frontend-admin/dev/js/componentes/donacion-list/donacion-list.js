angular.module('app')
.component('donacionList', {
	templateUrl: './components/donacion-list.html',
	//transclude: true,
	bindings: {
		donaciones: '<',
		size:'@',
		title:'@'
	},
	controller: ['$timeout','$interval',function(t,i) {
	    
	    var vm = this;
			vm.data = [];
			vm.listPos = 0;
			vm.colorPos = 0;
			vm.size = 0;
			vm.started = false;
			vm.colors = [
				'#dcce80',
				'#c9985f',
				'#789391',
				'#666878',
				'#45642f',
				'#362247',
				'#dfedef',
				'#695883',
				'#746c6a',
				'#bcb4ba',
				'#c07d9c',
				'#717c05',
				'#f9dde1',
				'#afb56c',
				'#debea0',
				'#9dbab3',
				'#aab7c9',
				'#d6c42b',
				'#38363b',
				'#a4545f'
		];

			this.$onInit = function() {
				this.uniqueId = String(performance.now()).replace('.','');
			};

			this.$onChanges = function() {
				vm.interval = i(function(){
					vm.initList();
				},500);
			}

			this.initList = function(){
				if(this.donaciones && this.donaciones.length!=0 && !vm.started){
					for(var e = 0; e < vm.size; e++){
						this.donaciones[e].color = vm.colors[vm.colorPos];
						vm.data.push(this.donaciones[e]);
						vm.colorPos++;
					}
					vm.listPos = vm.size;

					i(function(){
						if(vm.listPos == vm.donaciones.length){
							vm.listPos = 0;
						}
						if(vm.colorPos == vm.colors.length){
							vm.colorPos = 0;
						}
						vm.donaciones[vm.listPos].color = vm.colors[vm.colorPos];
						vm.data.push(vm.donaciones[vm.listPos])
						vm.listPos++;
						vm.colorPos++;
						vm.data.shift()
					},2000);
					vm.started = true;
					i.cancel(vm.interval);
				}
			}
	  }]
});