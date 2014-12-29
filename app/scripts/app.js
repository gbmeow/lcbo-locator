'use strict';

/**
 * @ngdoc overview
 * @name boozerApp
 * @description
 * # boozerApp
 *
 * Main module of the application.
 */
angular
  .module('boozerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/category/:categoryName', {
        templateUrl: 'views/category.html',
        controller: 'itemCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('productSource', ['$resource', function($resource){
    return $resource('https://lcboapi.com/products?access_key=MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw&page=:pageNumber', {pageNumber: '@number'});
      // {'ACCESS_K': 'MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw',
      //   'ITEMS_N': '@number',
      //   'PAGE_N' : '@number'
      //   });
  }]);
