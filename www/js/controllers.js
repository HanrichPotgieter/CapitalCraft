angular.module('starter.controllers', [])

.controller('AccountCtrl', function($scope, $ionicPopup, $timeout, $state, $ionicLoading, User, Beers) {
	$scope.settings = {
		enableFriends: true
	};

	$scope.isLoggedOn = User.isLoggedIn;

$scope.logout = function(){
		User.set('No User');
};

$scope.showPopup = function(url,t) {
	$scope.data = {};
	// An elaborate, custom popup
	var myPopup = $ionicPopup.show({
		templateUrl: url,
		title: t,
		scope: $scope,
		buttons: [
			{ text: 'Cancel' },
			{
				text: '<b>' + t + '</b>',
				type: 'button-positive',
				onTap: function(e) {
					return $scope.data;
				}
			}
		]
	}).then(function(res) {
		if(!res.first){
      $ionicLoading.show({
      	template: '<ion-spinner icon=\"ripple\"></ion-spinner>',
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
			var ref = window.localStorage['firebase'] || new Firebase("https://capitalcraft.firebaseio.com");
			ref.authWithPassword({
			  email    : res.email,
			  password : res.password
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			    User.set(authData);
          Beers.listForUser(User.get().uid, function(res){
            User.mybeers = res;
            $state.go("tab.beers");
            $ionicLoading.hide();
          });
			  }
			});
		}
		else{
			var ref = window.localStorage['firebase'] || new Firebase("https://capitalcraft.firebaseio.com");
			ref.createUser({
			  email    : res.email,
			  password : res.password
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			  }
			});
			console.log(res.first);
			console.log(res.last);
		}
	});
};
})

.controller('MyBeerCtrl', function($scope, $stateParams, $state, $ionicLoading, Beers, User) {
  $scope.isLoggedOn = User.isLoggedIn;
  $scope.beers = Beers.list();
  $scope.loginOrRegister = function() {
  	$state.go("tab.account");
  };
  $scope.rated = function(beer) {
    for (var i in User.mybeers) {
      if (beer.$id === User.mybeers[i]) {
        return true;    
      }
    }
    return false;
  };
})

.controller('BeerCtrl', function($scope, $stateParams, $state, $ionicLoading, Beers) {
  $scope.beers = Beers.list();

  $ionicLoading.show({
  	template: '<ion-spinner icon=\"ripple\"></ion-spinner>',
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  $scope.beers.$loaded()	
    .then(function() {
      $ionicLoading.hide();
    });

  $scope.addBeer = function() {
    $state.go('tab.beers-add');
  };
  $scope.remove = function(beerId) {
    Beers.remove(beerId);
  };
})

.controller('BeerDetailCtrl', function($scope, $ionicPopup, $stateParams, $state, $ionicLoading, Beers, User){
  $scope.beer = JSON.parse($stateParams.beer);
  $scope.bate = $scope.beer.avgRating;
  $scope.max = 10;
  $scope.isLoggedIn = function() {
    return User.isLoggedIn();
  };

  $scope.rate = function() {
      $ionicLoading.show({
      template: '<ion-spinner icon=\"ripple\"></ion-spinner>',
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    var oldRating = null;
    var res = window.localStorage['firebaseRatingUid'] ||  new Firebase('https://capitalcraft.firebaseio.com/ratings/'+User.get().uid+'/'+$scope.beer.$id);
      $scope.data = {};
      canceled = false;
      $ionicLoading.hide();
      if (res !== null) {
        $scope.data.rating = res;
        oldRating = $scope.data.rating;
      }
        var myPopup = $ionicPopup.show({
        template : '<rating ng-model="data.rating" max="max" style="font-size:10px;!important"></rating>',
        title : 'Rate ' + $scope.beer.title,
        subtitle : 'What do you think of ' + $scope.title.beer + '?',
        scope : $scope,
        buttons : [
          {
            text : 'Cancel',
            onTap : function(e) {
              canceled = true;
            }
          },
          {
            text : '<b>Save</b>',
            type : 'button-positive',
            onTap: function(e) {
              if (!$scope.data.rating) {
                e.preventDefault();
              } else {
                return $scope.data.rating;
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        if (canceled !== true) {
            var user = User.get();
            var ref = window.localStorage['firebaseRatingUid'] || new Firebase('https://capitalcraft.firebaseio.com/ratings/'+user.uid+'/'+$scope.beer.$id);
            ref.child('rating').set(res);
            User.mybeers.push($scope.beer.$id);
            var beer = Beers.get($scope.beer.$id);
            beer.once('value',function(data) {
              var curAvg;
              var newAvg;
              if (oldRating !== null) {
                curAvg = data.val().avgRating * parseInt(data.val().numRates) - oldRating;
                newAvg = (curAvg + parseInt(res)) / (parseInt(data.val().numRates));
                beer.child('avgRating').set(newAvg);
                $scope.bate = newAvg;
              } else {
                curAvg = data.val().avgRating * parseInt(data.val().numRates);
                newAvg = (curAvg + parseInt(res)) / (parseInt(data.val().numRates) + 1);
                beer.child('avgRating').set(newAvg);
                beer.child('numRates').set(parseInt(data.val().numRates) + 1);
                $scope.bate = newAvg;
                $scope.beer.numRates = parseInt(data.val().numRates) + 1;
              }
            });
          }
      });
    };
})

.controller('BeerAddCtrl',function($scope, $stateParams, $state, Beers) {
  $scope.beers = Beers.list();
  $scope.beer = Object;
  $scope.beer.avgRating = 0.0;
  $scope.addBeer = function() {
    $scope.beers.$add({
      'manufacturer' : $scope.beer.manufacturer,
      'title' : $scope.beer.title,
      'avgRating' : parseFloat($scope.beer.avgRating).toFixed(2),
      'numRates' : parseInt(0),
      'description' : $scope.beer.description
    });
    $scope.beer.manufacturer = '';
    $scope.beer.title = '';
    $scope.beer.avgRating = 0.0;
    $scope.beer.description = '';
    $state.go('tab.beers');
  };
});

