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
  .factory('productSearch', ['$resource', function($resource) {
    return $resource('https://lcboapi.com/products?access_key=MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw&q=:query', {query: '@query'});
  }])
  .factory('productSource', ['$resource', function($resource){
    return $resource('https://lcboapi.com/products?access_key=MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw&page=:pageNumber', {pageNumber: '@number'});
  }])
  .factory('favouriteManager', ['$localStorage', function($localStorage) {
    
    var favourites  = [];
    var favourite   = this;

    this.saveToFav = function(item) {
      favourites.push(item);
      $localStorage.fav = favourites;
    }
    this.removeFav = function(index) {
      favourites.splice(index, 1);
      $localStorage.fav = favourites;
    }
    this.getAll = function() {
      return $localStorage.fav;
    }

    return favourite;

  }])
  .directive('myFav', function() {
    return {
      restrict: "E",
      templateUrl: 'views/myFavs.html',
      scope: {model: "=ngModel"},
      link: function(scope) {
        scope.items = scope.model;
        scope.$watch('model', function() {
          scope.items = scope.model;
        })
      }
    }
  })
