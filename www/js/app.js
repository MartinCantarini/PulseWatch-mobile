angular.module('starter', ['ionic','starter.controllers','ngCordova'])
.run(function($ionicPopup,$ionicPlatform) {
  $ionicPlatform.ready(function() {
  });
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        })
        .state('pulsaciones', {
          url: '/pulsaciones',
          templateUrl: 'templates/pulsaciones.html',
          controller: 'PulseApp'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        })
        .state('logup', {
          url: '/logup',
          templateUrl: 'templates/logup.html',
          controller: 'LoginCtrl'
        })
        .state('estadisticas', {
          url: '/estadisticas',
          templateUrl: 'templates/estadisticas.html',
          controller: 'EstadisticaCtrl'
        })
        .state('alertas', {
          url: '/alertas',
          templateUrl: 'templates/alertas.html',
          controller: 'PulseApp'
        })
        .state('ayuda', {
          url: '/ayuda',
          templateUrl: 'templates/ayuda.html'
        })
    // Página por defecto
    $urlRouterProvider.otherwise('/');
});