angular.module('starter.services', [])

.factory("User", function() {
  var user =  window.localStorage['currentUser'] || 'No User';
  console.log(user);
  return {
    get:function(){
    return user;
  },
    set:function(_user){
      user = _user;
      window.localStorage['currentUser'] = user;
  },
    isLoggedIn:function(){
      if(user === 'No User'){
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
      var itemsRef = window.localStorage['ratingsId'] ||  new Firebase("https://capitalcraft.firebaseio.com/ratings/" + id);
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
  var beers = new Firebase("https://capitalcraft.firebaseio.com/beers");
  var ratings = new Firebase("https://capitalcraft.firebaseio.com/ratings");
  return {
    list: function() {
      var itemsRef = window.localStorage['beers'] || new Firebase("https://capitalcraft.firebaseio.com/beers");
      return  $firebaseArray(itemsRef.orderByChild("manufacturer"));
    },
    listForUser : function(uid, callback) {
      var returnThis = [];
      ratings.once('value', function(data) {
        var tmp = data.val()[uid];
        for (var property in tmp) {
          if (tmp.hasOwnProperty(property)) {
              returnThis.push(property);
          }
        }
        callback(returnThis);
      });
    },
    getBeerRating : function(uid, beerId, callback) {
      ratings.once('value', function(data) {
        var tmp = data.val()[uid][beerId];
        if (tmp === undefined) {
          callback(null);  
        } else {
          callback(tmp.rating);
        }
        
      });
    },
    get : function(beerId) {
      return beers.child(beerId);
    },
    remove : function(beerId) {
      beers.child(beerId).set(null);
    }
  };
});
