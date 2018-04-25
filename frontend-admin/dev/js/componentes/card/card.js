angular.module('app')
    .component('card', {
        templateUrl: './components/card.html',
        transclude: {
            'footer': '?div'
        },
        bindings: {
            cardIcon: '@',
            cardColor: '@',
            cardTitle: '@',
            data: '<',
            cardSize: '@',
            offset: '@',
            classCstm: '@',
            donateAction: '&',
            highlight:'@'
        },
        controller: ['$rootScope',function(r) {
        
                    var vm = this;
        			vm.isMobile = r.isMobile;
                    vm.donate = function() {
                        vm.donateAction({
                            item: vm.data
                        });
                    };
        
                    this.$onInit = function() {
                        this.uniqueId = 'card-' + String(performance.now()).replace('.', '');
                        if (this.offset)
                            this.classOffset = 'col-md-offset-' + this.offset;
        
                    };
                }]
    });