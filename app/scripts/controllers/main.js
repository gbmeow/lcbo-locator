'use strict';

/**
 * @ngdoc function
 * @name boozerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the boozerApp
 */
angular.module('boozerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
