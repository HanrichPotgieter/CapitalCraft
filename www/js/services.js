angular.module('starter.services', [])

.factory("User", function() {
  var user = undefined;
  return {
    get:function(){
    return user;
  },
    set:function(_user){
      user = _user;
  },
    isLoggedIn:function(){
      if(user === undefined){
        return false;
      }
      else{
        return true;
      }
     }
  };
})

.factory("Ratings", function($firebaseArray) {
  return {
    get:function(){
    return rating;
  },
    list: function(id) {
      var itemsRef = new Firebase("https://capitalcraft.firebaseio.com/ratings/" + id);
      console.log(itemsRef);
      return  $firebaseArray(itemsRef);
    },
    set:function(_rating){
      //die werk nie
      rating = _rating;
  }
 };
})

.factory('Beers', function($firebaseArray) {
  return {
    list: function() {
      var itemsRef = new Firebase("https://capitalcraft.firebaseio.com/beers");
      return  $firebaseArray(itemsRef.orderByChild("manufacturer"));
      
    },
    get : function(beerId) {
      var itemsRef = new Firebase("https://capitalcraft.firebaseio.com/beers/"+beerId);
      return itemsRef;
    },
    remove : function(beerId) {
      var itemsRef = new Firebase("https://capitalcraft.firebaseio.com/beers");
      itemsRef.child(beerId).set(null);
    }
  };
});
