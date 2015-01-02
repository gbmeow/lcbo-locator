'use strict';

/**
 * @ngdoc function
 * @name boozerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the boozerApp
 */
angular.module('boozerApp')
  .controller('MainCtrl', ['$scope', 'productSource', 'productSearch', 'favouriteManager', '$localStorage', '$timeout', function ($scope, productSource, productSearch, favouriteManager, $localStorage, $timeout) {

  	var dataContainer = []; 
  		//Limiting it to 3 pages of data
  		//Reason: API does not provide a way to get items out by category

  	var beer = [];
  	var wine = [];
  	var spirits = [];
  	var ciders = [];

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

            if (data.result.length === 0) {
                $scope.notFound = "Hey Cannot find";
                console.log(data.suggestion);
                $scope.suggestion  = data.suggestion;
              
              //Show and Hide message
              $timeout(function() {
                $scope.notFound = '';
              $scope.suggestion = '';
                
              }, 2000);
              
            } else {
              $scope.searchResult.push(data.result);
            }
            
          })  
        $scope.query = '';
      }

      $scope.favourites = favouriteManager.getAll();

      $scope.addToFav = function(item) {
        favouriteManager.saveToFav(item);
      }

  	 function breakProductIntoCat(dataset) {
  		dataset.forEach(function(singleSet) {
  			singleSet.forEach(function(singleElement) {
				  processElement(singleElement, singleElement['primary_category']);
  			})
  		});

      //1 Time load - not sure if it requires a service
      $localStorage.$default({
        beer: beer,
        wine: wine,
        spirits: spirits,
        ciders: ciders
      });
  	}

    //Not sure if this is the best way to do it
      //should be done more programmatically
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

  }])
	.controller('itemCtrl', ['$scope', '$stateParams', '$state', '$localStorage', 'favouriteManager', function($scope, $stateParams, $state, $localStorage, favouriteManager){
		var category = $stateParams.categoryName;

    //Get rid of $localStorage 
      //Move it into its own service to manage our LocalStorage access 
		$scope.items = $localStorage[category];

    $scope.addToFav = function(item) {
        favouriteManager.saveToFav(item);
        $state.go('index');
    }

	}])
  .controller('storeCtrl', ['$scope', '$stateParams', '$localStorage', 'favouriteManager', 'closestStores', 'storeInventory', function($scope, $stateParams, $localStorage, favouriteManager, closestStores, storeInventory){
    var drinkId  = $stateParams.id;
    $scope.stores = [];  

    $localStorage.fav.forEach(function(object) {
      if (object.id == drinkId) {
        $scope.drink = object.name;
      }
    });

    if (!$localStorage.location) {
      navigator.geolocation.getCurrentPosition(LocationLoadedsuccess, LocationLoadederror);
    } else {

      var latitude  = $localStorage.latitude;
      var longitude = $localStorage.longitude;
      closestStores.get({lat: latitude, lon: longitude})
        .$promise.then(function(closStoredata) {
            storeInventory.get({drinkId: drinkId})
              .$promise.then(function(prodStoredata) {  
                filterStores(closStoredata.result, prodStoredata.result);    
              });
            
      });
      }


        //#1) Could not call lcboapi.com/stores/{store_id}/products/{product_id}/inventory directly 
        //#2) Less API calls 
      
      function filterStores(closStores, productStores) {
        productStores.forEach(function(storeWithProduct) {
          closStores.forEach(function(storeCloseToUser) {
            if (storeWithProduct.store_id === storeCloseToUser.id) {
              $scope.stores.push(storeCloseToUser);
            }

          })
        })
      }

    function LocationLoadedsuccess(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      favouriteManager.saveUserLocation(latitude, longitude);
    }

    function LocationLoadederror() {
      console.log("failed");
    }
    
  }])

  .controller('directionsCtrl', ['$scope', '$stateParams', '$localStorage', 'googleDirections', function($scope, $stateParams, $localStorage, googleDirections){
    var latitude  = $stateParams.lat;
    var longitude = $stateParams.lon;

    var userLocation = $localStorage.location.latitude +  ',' + $localStorage.location.longitude;
    var storeLocation = latitude +  ',' + longitude;

    //Client Side Google API
    var args = {
      origin: userLocation,
      destination: storeLocation,
      travelMode: 'driving'
    }

    $scope.directions;

    googleDirections.getDirections(args).then(function(directions) {
      $scope.directions = directions.routes[0].legs[0].steps;
    });

   }]);
