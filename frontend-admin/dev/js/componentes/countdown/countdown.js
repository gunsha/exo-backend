angular.module('app')
    .component('countdown', {
        templateUrl: './components/countdown.html',
        //transclude: true,
        bindings: {
            end:'@',
            start:'@'
        },
        controller: ['$timeout', '$interval', 'Util', function(t, i, Util) {

            var vm = this;
			var intervalTimer;
            vm.started = false;

            this.$onInit = function() {
                this.uniqueId = 'cd-' + String(performance.now()).replace('.', '');
            };

            this.$postLink = function() {
                vm.interval = i(function() {
                    vm.init();
                }, 500);
            };

            vm.init = function() {
                if (!vm.started) {
                    if (document.querySelector('#' + vm.uniqueId + ' .e-c-progress') && document.querySelector('#' + vm.uniqueId + ' .e-c-pointer')) {
                        this.progressBar = document.querySelector('#' + vm.uniqueId + ' .e-c-progress');
                        this.pointer = document.querySelector('#' + vm.uniqueId + ' #e-pointer');
                        var length = Math.PI * 2 * 95;
                        var dif = (new Date().getTime() - this.start) * 100 / (this.end - this.start);
                        this.progressBar.style.strokeDasharray = length;
                        this.progressBar.style.strokeDashoffset = -length * (dif / 100);

                        vm.timer();
                        vm.started = true;
                        i.cancel(vm.interval);
                    }
                }
            };

            vm.update = function() {
                this.positionSec += 6;
                this.pointer.style.transform = 'rotate(' + (this.positionSec) + 'deg)';
            };

            this.positionSec = 0;
            vm.timer = function() {
                var diff = Math.floor(((new Date(Number(vm.end))).getTime() - new Date().getTime()) / 1000);
                var sec = 60 - Util.dhms(diff)[3];
                vm.positionSec = sec * 6;

                intervalTimer = setInterval(function() {
                    vm.displayTimeLeft();
                }, 1000);
            };

            vm.displayTimeLeft = function() {
                var timeLeft = 60 - (new Date()).getSeconds();
                vm.update(timeLeft);
            };
        }]


    });