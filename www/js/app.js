// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angularMoment', 'ngRoute', 'firebase' , 'ngCookies'])

.run(function($rootScope, $ionicPlatform, $httpBackend, $http,  $location, Auth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  /*var authorized = false;
  var customers = [{name: 'John Smith'}, {name: 'Tim Johnson'}];
  
  // returns the current list of customers or a 401 depending on authorization flag
  $httpBackend.whenPOST('https://rederick3.aws.af.cm/posts').respond(function (method, url, data, headers) {

      console.log(data);

     return authorized ? [200, customers] : [401];
  });
  $httpBackend.whenPOST('https://login').respond(function(method, url, data) {
    authorized = true;
    return  [200 , { authorizationToken: "NjMwNjM4OTQtMjE0Mi00ZWYzLWEzMDQtYWYyMjkyMzNiOGIy" } ];
  });
  $httpBackend.whenPOST('https://logout').respond(function(method, url, data) {
    authorized = false;
    return [200];
  });
  // All other http requests will pass through*/
  //$httpBackend.whenGET(/.*/).passThrough();

  /*$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !Auth.isLoggedIn()){
        // User isn’t authenticated
        $state.transitionTo("login");
        event.preventDefault(); 
      }
    });*/

  $rootScope.$on("$routeChangeStart", function (event, next, current) {
      $rootScope.error = null;
      if (!Auth.authorize(next.access)) {
          if(Auth.isLoggedIn()) $location.path('/app/playlists');
          else                  $location.path('/login');
      }

      if(Auth.isLoggedIn()){

          /*Users.getByUsername({username:Auth.user.username} , 
          function(res){

              //console.log(res[0]);
              if(res.length != 0){
                  $rootScope.imgProfile = res.picture + '?' + (Math.random()*10);
                  $rootScope.fullname = res.name;
              }

          }, function(err){
              $rootScope.error = err;
          });*/

      }   
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  var access = routingConfig.accessLevels;
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' : {
          controller:  "HomeCtrl",
          templateUrl: "templates/home.html"
        }
      },   
      access : access.user      
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.tab.playlists', {
      url: "/playlists",
      views: {
        'tab-posts' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
          
        }
      },
      access : access.user
    })

    .state('app.customers', {
      url: "/customers",
      views: {
        'menuContent' : {
          controller:  "CustomerCtrl",
          templateUrl: "templates/customers.html"             
        }
      }         
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      },
      access : access.user
    })

    .state('app.tab', {
      url: "/tab",
      //abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/tabs.html',
          controller: 'TabsCtrl'
        }
      }
    })

    // Each tab has its own nav history stack:

    .state('app.tab.events', {
      url: '/events',
      views: {
        'tab-events': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('app.tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('app.tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

    .state('app.tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tab/playlists');
});

