'use strict';

/**
 * @ngdoc overview
 * @name boozerApp
 * @description
 * # boozerApp
 *
 * Main module of the application.
 */
angular.module('boozerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router'
  ])
  .config(function ($stateProvider) {
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                "appContent": {
                    templateUrl: "views/main.html",
                    controller: 'MainCtrl'
                }
            }
        })
        .state('category', {
            url: "/category/:categoryName",
            views: {
                "appContent": {
                    templateUrl: "views/category.html",
                    controller: 'itemCtrl'
                }
            }
        })
        .state('stores', {
            url: "/stores/:id",
            views: {
                "appContent": {
                    templateUrl: "views/closestStores.html",
                    controller: 'storeCtrl'
                }
            }
        })
        .state('directions', {
            url: "/directions/:lat/:lon",
            views: {
                "appContent": {
                    templateUrl: "views/directionsStores.html",
                    controller: 'directionsCtrl'
                }
            }
        })
  })
  .factory('productSearch', ['$resource', function($resource) {
    return $resource('https://lcboapi.com/products?access_key=MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw&q=:query', {query: '@query'});
  }])
  .factory('productSource', ['$resource', function($resource){
    return $resource('https://lcboapi.com/products?access_key=MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw&page=:pageNumber', {pageNumber: '@number'});
  }])
  .factory('closestStores', ['$resource', function($resource) {
    return $resource('https://lcboapi.com/stores?access_key=MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw&lat=:lat&lon=:lon&per_page=10', {lat: '@name', lon: '@name'});
  }])
  .factory('storeInventory', ['$resource', function($resource) {
    return $resource('https://lcboapi.com/inventories?access_key=MDpmNTE3YmNhZS04YmM1LTExZTQtODM0ZC1iYjUyY2YzYTNhMWM6dFZPaTRLNXRjRXZnZGhKM1JhMnJvTHhjZm9ldEtXYms4dGEw&product_id=:drinkId', {drinkId: '@name'});
  }])
  .factory('directionsToStore', ['$resource', function($resource) {
    return $resource('https://maps.googleapis.com/maps/api/directions/json?origin=:user&destination=:store&key=AIzaSyAf2rjkM1dFE1ZTNTkyrPRHnv1a66zvO3g', {user: '@name', store: '@name'});
  }])
  .factory('favouriteManager', ['$localStorage', function($localStorage) {
    var favourite   = this;

    this.itemExists = function(item) {
      var keepGoing = true;
      $localStorage.fav.forEach(function(one) {
        if (one.id === item.id) {
          keepGoing = false;
        }
      });
      return keepGoing;
    }
    this.saveToFav = function(item) {
      if (!$localStorage.fav) {
        $localStorage.$default({
          fav: []
        });
      } 
      var flag = this.itemExists(item);
      if (flag) {
        $localStorage.fav.push(item);
      }
     
    }
    this.removeFav = function(index) {
      $localStorage.fav.splice(index, 1);
    }
    this.getAll = function() {
      return $localStorage.fav;
    }

    this.saveUserLocation = function(latitude, longitude) {
      var location = {};
      location.latitude   =  latitude;
      location.longitude  =  longitude;
      $localStorage.location = location;
    }

    return favourite;

  }])
  .directive('myFav', ['favouriteManager', function(favouriteManager) {
    return {
      restrict: "E",
      templateUrl: 'views/myFavs.html',
      scope: {model: "=ngModel"},
      link: function(scope) {
        scope.items = scope.model;
        scope.$watch('model', function() {
          scope.items = scope.model;
        })
        scope.remove = function(index) {
          favouriteManager.removeFav(index); 
        }
        }
    }
  }])
