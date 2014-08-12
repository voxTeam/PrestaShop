'use strict';

/**
 * @ngdoc overview
 * @name modulesApp
 * @description
 * # modulesApp
 *
 * Main module of the application.
 */
angular
  .module('modulesApp', [
    'ngResource',
    'ngRoute',
    'wu.masonry'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/tabs/tab-catalog.html',
        controller: 'CatalogCtrl'
      })
      .when('/configure', {
        templateUrl: 'views/tabs/tab-configure.html',
        controller: 'ConfigureCtrl'
      })
      .when('/notifications', {
        templateUrl: 'views/tabs/tab-notifications.html',
        controller: 'ConfigureCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', function($rootScope, $location){
    var path = function() { return $location.path();};
    $rootScope.$watch(path, function(newVal, oldVal){
      $rootScope.activetab = newVal;
     });
  }]);