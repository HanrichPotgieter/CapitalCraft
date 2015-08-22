angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
})

.controller('ListCtrl', function($scope, $stateParams, Chats, Items) {
	$scope.items = Items;
	$scope.addItem = function() {
		var name = prompt("What do you need to buy?");
		if (name) {
			$scope.items.$add({
				"name": name
			});
		}
	};
})

.controller('AccountCtrl', function($scope, $ionicPopup, $timeout, $state, User) {
	$scope.settings = {
		enableFriends: true
	};

	$scope.isLoggedOn = User.isLoggedIn;
	$scope.isNotLoggedOn = User.isNotLoggedIn;
	
$scope.logout = function(){
		User.set(undefined);
		console.log(User.get());
};

$scope.showPopup = function(url,t) {
	$scope.data = {}

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
		if(!res.first)
		{
			var ref = new Firebase("https://capitalcraft.firebaseio.com");
			ref.authWithPassword({
			  email    : res.email,
			  password : res.password
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			    User.set(authData);
			    $state.go("tab.account");
			  }
			});
		}
		else
		{
			var ref = new Firebase("https://capitalcraft.firebaseio.com");
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

});
