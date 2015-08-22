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

.controller('ListCtrl', function($scope, $stateParams, Items) {
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

.controller('BeerCtrl', function($scope, $stateParams, $state, Beers) {
  $scope.beers = Beers.list();
  $scope.addBeer = function() {
    $state.go('tab.beers-add');
  };
  $scope.remove = function(beerId) {
    Beers.remove(beerId);
  };
})

.controller('BeerDetailCtrl', function($scope, $stateParams, $state, Beers){
  $scope.beer = JSON.parse($stateParams.beer);
})

.controller('BeerAddCtrl',function($scope, $stateParams, $state, Beers) {
  $scope.beers = Beers.list();
  $scope.beer = Object;
  $scope.beer.price = 0.0;
  $scope.addBeer = function() {
    $scope.beers.$add({
      'title' : $scope.beer.title,
      'price' : parseFloat($scope.beer.price).toFixed(2),
      'description' : $scope.beer.description
    });
    $scope.beer.title = '';
    $scope.beer.price = 0.0;
    $scope.beer.description = '';
    $state.go('tab.beers');
  };
})
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
