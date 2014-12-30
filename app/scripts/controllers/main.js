'use strict';

/**
 * @ngdoc function
 * @name boozerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the boozerApp
 */
angular.module('boozerApp')
  .controller('MainCtrl', function ($scope, productSource, productSearch, favouriteManager, $localStorage) {

  	var dataContainer = []; 
  		//Limiting it to 3 pages of data
  		//Reason: API does not provide a way to get items out by category

  	var beer = [];
  	var wine = [];
  	var spirits = [];
  	var ciders = [];

    $scope.$storage = $localStorage;

  	//Chaining $promises here - to populate dataContainer	
	 var pullDatasetFromLCBO = 
		productSource.get({pageNumber: 1})
			.$promise.then(function(data) {
      			dataContainer.push(data.result);

      	productSource.get({pageNumber: 2})
      		.$promise.then(function(data) {
      			dataContainer.push(data.result);
      	
      	productSource.get({pageNumber: 3})
		     .$promise.then(function(data) {
		      	dataContainer.push(data.result);
		      	breakProductIntoCat(dataContainer);
		      	})
      		
      		});

    	});

      //Search Functionality 
      $scope.searchResult = [];
      $scope.search = function(query) {
        productSearch.get({query: query})
          .$promise.then(function(data) {
            $scope.searchResult.push(data.result);
          })  
      }

      $scope.delete = function(index) {
      }

      $scope.favourites = favouriteManager.getAll();

      $scope.addToFav = function(item) {
        favouriteManager.saveToFav(item);
        $scope.favourites = $localStorage.fav;
      }

  	 function breakProductIntoCat(dataset) {
  		dataset.forEach(function(singleSet) {
  			singleSet.forEach(function(singleElement) {
				var elementCategory = singleElement['primary_category'];
				processElement(singleElement, elementCategory);
  			})
  		});
      $scope.$storage = $localStorage.$default({
        beer: beer,
        wine: wine,
        spirits: spirits,
        ciders: ciders
      });
  	}

  	function processElement(element, category) {
  			switch (category) {
  				case "Beer":
  					beer.push(element);
  					break;
  				case "Wine":
  					wine.push(element);
  					break;
  				case "Spirits":
	  				spirits.push(element);
	  				break;
	  			case "Ciders":
	  				ciders.push(element);
	  				break;
  			}
  	}

  })
	.controller('itemCtrl', function($scope, $routeParams, $localStorage){
		var category = $routeParams.categoryName;
		$scope.items = $localStorage[category];

	});
