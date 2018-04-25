angular.module('app').controller('navCtrl', ['$scope', '$rootScope', '$location', '$anchorScroll', 'navService', '$state', '$timeout', navCtrl]);

function navCtrl(s, r, $location, $anchorScroll, navService, state, t) {

    var vm = this;
    vm.logout = function() {
        r.user = false;
    };

    var refScroll = r.scroll;
    
    vm.navigate = function(section) {
        if (state.name !== 'app')
            state.go('app');
        if (!$("#" + section).offset())
            t(function(section) {
                    if (!$("#" + section).offset())
                        vm.navigate(section);
                    else
                        $('html, body').animate({
                            scrollTop: $("#" + section).offset().top - 57
                        }, 1000);
                },
                300, true, section);
        else {
            $('html, body').animate({
                scrollTop: $("#" + section).offset().top - 57
            }, 1000);
        }
    };

    if (refScroll) {
        vm.navigate(refScroll);
    }

    r.navigate = vm.navigate;

}