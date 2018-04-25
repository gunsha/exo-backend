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