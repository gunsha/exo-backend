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