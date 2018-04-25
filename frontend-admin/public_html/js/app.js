var monthsShortDot$1 = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
var monthsShort$2 = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

moment.defineLocale('es', {
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort: function(m, format) {
        if (!m) {
            return monthsShortDot$1;
        } else if (/-MMM-/.test(format)) {
            return monthsShort$2[m.month()];
        } else {
            return monthsShortDot$1[m.month()];
        }
    },
    monthsParseExact: true,
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY H:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm'
    },
    calendar: {
        sameDay: function() {
            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextDay: function() {
            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        nextWeek: function() {
            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastDay: function() {
            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        lastWeek: function() {
            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
        },
        sameElse: 'L'
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d minutos',
        h: 'una hora',
        hh: '%d horas',
        d: 'un día',
        dd: '%d días',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: '%dº',
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    
    // Initialize and Configure Scroll Reveal Animation
    // window.sr = ScrollReveal();
    // sr.reveal('.sr-icons', {
    //     duration: 600,
    //     scale: 0.3,
    //     distance: '0px'
    // }, 200);
    // sr.reveal('.sr-button', {
    //     duration: 1000,
    //     delay: 200
    // });
    // sr.reveal('.sr-contact', {
    //     duration: 600,
    //     scale: 0.3,
    //     distance: '0px'
    // }, 300);
    transparent = true;
    setTransparent = true;

$(document).scroll(function() {
    if( $(this).scrollTop() > 40 ) {
        if(transparent && setTransparent) {
            transparent = false;
            $('nav[role="navigation"]').removeClass('navbar-transparent');
        }
    } else {
        if( !transparent && setTransparent) {
            transparent = true;
            $('nav[role="navigation"]').addClass('navbar-transparent');
        }
    }
});

var apiRoute = '';

angular.module('app', ['ui.router', 'angular-jwt', 'angular-growl', 'angular-table'])
    .run(['$rootScope', '$state', 'authManager', 'jwtHelper', '$anchorScroll', 'growl', function(r, s, authManager, jwtHelper, $anchorScroll, growl) {
        r.hideNav = false;
        r.navTitle = '';
        r.active = s.current.name;

        r.isMobile = window.matchMedia("(max-width: 768px)").matches;

        r.setStorage = function(name, obj) {
            localStorage.setItem(name, JSON.stringify(obj));
        };

        r.getStorage = function(name) {
            return JSON.parse(localStorage.getItem(name));
        };

        if (authManager.isAuthenticated() && !r.user) {
            r.user = jwtHelper.decodeToken(localStorage.getItem('id_token')).user;
            r.user.profile = r.getStorage('profile');
        }
        r.logout = function() {
            localStorage.removeItem('id_token');
            localStorage.removeItem('profile');
            r.user = false;
            if (s.current !== 'app') {
                s.go('app');
                swal.close();
                $('.modal').modal('hide');
            }
        };

        r.hasRole = function(role) {
            if (r.user && r.user.rol) {
                if (typeof r.user.rol.descripcion === "string") {
                    return r.user.rol.descripcion === role;
                } else {
                    for (var i in r.user.rol) {
                        if (r.user.rol[i] === role)
                            return true;
                    }
                }
            }
            return false;
        };

        r.findByAttr = function(a, q, attr) {
            return a.filter(function(i) {
                if (i[attr] === q) {
                    return i;
                }
                return false;
            })[0];
        };
        authManager.checkAuthOnRefresh();
        authManager.redirectWhenUnauthenticated();
        r.$on('tokenHasExpired', function() {
            r.logout();
        });

        r.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            setTransparent = true;
            r.profile = r.getStorage('profile');
            r.hideNav = false;
            r.hideGrowl = toState.data && toState.data.hideGrowl;
            if (toState.data && toState.data.requiresLogin && !r.user || (toState.data && toState.data.requiresRole && !r.hasRole(toState.data.requiresRole))) {
                growl.error('acceso no autorizado');
                console.log('acceso no autorizado')
                event.preventDefault();
                if (s.current !== 'auth') {
                    s.go('auth');
                    swal.close();
                    $('.modal').modal('hide');
                }
            }
            $anchorScroll(0);
        });

        r.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.data && toState.data.pageTitle)
                r.navTitle = toState.data.pageTitle;
            r.active = s.current.name;
        });

        r.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            console.log(unfoundState.to);
            console.log(unfoundState.toParams);
            console.log(unfoundState.options);
            s.go('app');
        });

        r.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            console.log(error);
            s.go('app');
        });

        r.showWait = function() {
            r.loading = true;
        };
        r.dismissWait = function() {
            r.loading = false;
        };
    }])
    .factory('httpInerceptor', ['$q', 'growl', '$rootScope', function($q, growl, r) {
        return {
            response: function(response) {
                if (response.data.status !== 406 && response.data.message)
                    growl.success(response.data.message);
                r.block = false;
                return response || $q.when(response);
            },
            responseError: function(response) {
                var msg;
                if (response.status == 406) {
                    msg = response.data.message;
                } else if (response.status == 403) {
                    msg = "Acceso denegado.";
                    r.logout();
                } else {
                    msg = "Ocurrio un error inesperado.";
                }
                growl.error(msg);
                return $q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', 'jwtOptionsProvider', 'growlProvider',
        function($httpProvider, jwtOptionsProvider, growlProvider) {
            jwtOptionsProvider.config({
                whiteListedDomains: ['custom-env-1.p3pgmucr9c.sa-east-1.elasticbeanstalk.com', 'api.app.com.ar', 'localhost'],
                unauthenticatedRedirectPath: '/login',
                tokenGetter: ['options', function(options) {
                    // Skip authentication for any requests ending in .html
                    if (options && options.url && options.url.substr(options.url.length - 5) == '.html') {
                        return null;
                    }
                    return localStorage.getItem('id_token');
                }]
            });
            $httpProvider.interceptors.push('jwtInterceptor');
            $httpProvider.interceptors.push('httpInerceptor');
            growlProvider.globalTimeToLive(3000);
            growlProvider.globalDisableCountDown(true);
            growlProvider.globalDisableIcons(true);

        }
    ])
    .filter('unsafe', ['$sce', function($sce) {
        return $sce.trustAsHtml;
    }])
    .filter('splitComma', function() {
        return function(input) {
            var text = typeof input === 'string' ? input.split(',') : input;
            var count = 0;
            var rText = '';
            text.map(function(i) {
                rText += i.charAt(0).toUpperCase() + i.slice(1).toLowerCase() + ',';
                if (count % 2 == 1 && count !== text.length - 1) {
                    rText += '<br>';
                }
                count++;
            });
            return rText.substring(0, rText.length - 1);
        };
    })
    .filter('replaceCommaSpace', function() {
        return function(input) {
            if (input)
                return input.replace(/,/g, ' ');
        };
    })
    .filter('monthNameUC', function() {
        return function(input) {
            var date = new Date(input);
            return months.short[date.getMonth()].toUpperCase();
        };
    })
    .filter('year', function() {
        return function(input) {
            var date = new Date(input);
            return date.getFullYear();
        };
    })
    .filter('fullDateShort', function() {
        return function(input) {
            var date = new Date(input);
            return date.getDate() + ' ' + months.short[date.getMonth()] + ' ' + date.getFullYear();
        };
    })
    .filter('upperCaseFL', function() {
        return function(input) {
            if (input) {
                var words = input.split(' ');
                for (var i in words) {
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
                }
                return words.join(' ');
            }
        };
    })
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter, {
                            'event': event
                        });
                    });
                }
            });
        };
    })
    .directive('isotopeRefresh', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                if (attrs.ngRepeat && scope.$last) {
                    $timeout(function() {

                    }, 300);
                }
            }
        };
    }])
    .directive('countdownText', ['Util','$interval',
        function(Util,$interval) {
            return {
                restrict: 'A',
                scope: {
                    date: '@'
                },
                link: function(scope,
                    element) {
                    var future;
                    future = new Date(Number(scope.date));
                    $interval(function() {
                            var diff;
                            diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                            var data = Util.dhms(diff);
                            return element.html([data[0] + 'd',
                        data[1] + 'h',
                        data[2] + 'm','<br><span class="seconds">',
                        data[3] + 's','<span>'
                    ].join(' '));
                        },
                        1000);
                }
            };
        }
    ]).factory('Util', [
        function() {
            return {
                dhms: function(t) {
                    var days,
                        hours,
                        minutes,
                        seconds;
                    days = Math.floor(t / 86400);
                    t -= days * 86400;
                    hours = Math.floor(t / 3600) % 24;
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    seconds = t % 60;
                    return [days,
                        hours,
                        minutes,
                        seconds
                    ];
                }
            };
        }
    ]);
//FIX PARA MODALES EN TEMPLATES
function appendModal() {
    var checkeventcount = 1,
        prevTarget;
    $('.modal').on('show.bs.modal', function(e) {
        if (typeof prevTarget == 'undefined' || (checkeventcount == 1 && e.target != prevTarget)) {
            prevTarget = e.target;
            checkeventcount++;
            e.preventDefault();
            $(e.target).appendTo('body').modal('show');
        } else if (e.target == prevTarget && checkeventcount == 2) {
            checkeventcount--;
        }
    });
}
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    '@': {
                        templateUrl: 'templates/layout.html'
                    },
                    'navView@app': {
                        templateUrl: 'templates/nav.html',
                        controller: 'navCtrl as ctrl'
                    },
                    'contentView@app': {
                        templateUrl: 'templates/index.html',
                        controller: 'indexCtrl as ctrl'
                    }
                },
                data:{
                    requiresLogin: true,
                    requiresRole: 'ADMIN',
                    pageTitle:'Inicio'
                }
            })
            .state('auth', {
                url: '/login',
                views: {
                    '@': {
                        templateUrl: 'templates/layout.html'
                    },
                    'contentView@auth': {
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl as ctrl'
                    }
                }
            })
            .state('app.users', {
                url: 'usuarios',
                views: {
                    'contentView@app': {
                        templateUrl: 'templates/usuarios.html',
                        controller: 'usuariosCtrl as ctrl'
                    }
                },
                data:{
                    requiresLogin: true,
                    requiresRole: 'ADMIN',
                    pageTitle:'Usuarios'
                }
            });
        $locationProvider.html5Mode(true);
    }]);
angular.module('app').factory('indexService', ['$rootScope', '$http', indexService]);

function indexService(r, h) {
    var service = {
    };

    return service;
}
angular.module('app').controller('indexCtrl',['$scope', '$rootScope', 'indexService','$state','$timeout','growl', indexCtrl]);

function indexCtrl(s, r, indexService,$state,t,growl){

	var vm = this;
  
}

angular.module('app').factory('navService', ['$rootScope',navService]);

function navService(r) {
    var service = {
    };

    return service;

}
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
angular.module('app').controller('usuariosCtrl', ['$rootScope', 'usuariosService', '$state','$timeout','$filter', usuariosCtrl]);

function usuariosCtrl(r, usuariosService, state, t, f) {
	var vm = this;
	
	vm.new = {};
    vm.list = [];
    vm.orig = [];
    vm.devList = [];
    vm.devOrig = [];
    vm.selected = {};
    vm.tableConfig = {"itemsPerPage":10,"maxPages":5};
    vm.filterText = '';
	
	vm.filtrarTabla = function(){
    	vm.list = f("filter")(vm.orig, vm.filterText);
    }; 

    vm.getAll = function() {
        usuariosService.getAll().then(function(data) {
            vm.list = data;
            vm.orig = data;
            vm.tooltip();
        });
    }

    vm.openModal = function(){
        vm.isEdit = false;
        vm.address = '';
        vm.new = {};
        $('#newUser').modal();
    }
    
    vm.remove = function(item) {
        vm.selected = item;
        swal({
            title: 'Seguro que desea eliminar al usuario?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(function() {
            usuariosService.remove(vm.selected).then(function() {
                vm.getAll();
                swal({
                    title: 'El usuario ha sido eliminado!',
                    type: 'success',
                    confirmButtonText: 'Aceptar'
                });
            });
        }).catch(swal.noop);
    }
    vm.edit = function(item) {
        vm.isEdit = true;
        vm.new = angular.copy(item);
        vm.new.password = '';
        $('#newUser').modal();
    };
    vm.save = function() {
        var obj = angular.copy(vm.new);
        if (!obj.id) {
            usuariosService.create(obj).then(function() {
                vm.new = {};
                vm.getAll();
                $('#newUser').modal('hide');
            })
        }else{
        	usuariosService.update(obj).then(function() {
                vm.new = {};
                vm.getAll();
                $('.modal').modal('hide');
            })
        }
    }

    vm.getAll();

    appendModal();

    vm.tooltip = function(){
        t(function(){
        $('[data-toggle="tooltip"]').tooltip();
        }, 300);
    }

    $('.modal').on('shown.bs.modal', function (e) {
        vm.tooltip();
    });
}