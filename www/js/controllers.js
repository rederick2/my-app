angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  /*$scope.login = function() {
    $scope.modal.show();
  };*/

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log($scope.loginData);

    $.ajax({
    	type 	: 'POST',
    	url 	: routingConfig.URL + '/login',
    	data 	: {username : $scope.loginData.username, password: $scope.loginData.password},
    	success	: function(response){
    		console.log(response);
    	}
    });
    

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LoginCtrl', function($scope, $http, $state, $location, Auth){


    $scope.message = "";

    $scope.error = '';
  
	$scope.user = {
		username: null,
		password: null
	};

	$scope.login = function() {
		//console.log('Login!')
		 Auth.login({
                username: $scope.user.username,
                password: $scope.user.password
                //rememberme: $scope.loginData.rememberme
            },
            function(res) {
                //console.log(res);
                //authFirebase.login('password', {email: res.email, password: res.password});
                $location.path('/playlists');
                //window.location.href = '/app';
            },
            function(err) {
                //console.log(err);
                $scope.error = err.error.message;
                $location.path('/login');

            });
		
	};

	$scope.$on('event:auth-loginRequired', function(e, rejection) {
		$scope.loginModal.show();
	});

	$scope.$on('event:auth-loginConfirmed', function(data) {
		$scope.username = null;
		$scope.password = null;
		//$scope.loginModal.hide();
		//console.log(data);

		//$location.path('/home');
	});

	$scope.$on('event:auth-login-failed', function(e, status) {
		var error = "Login failed.";
		if (status == 401) {
		  error = "Invalid Username or Password.";
		}
		$scope.message = error;
	});

	$scope.$on('event:auth-logout-complete', function() {
		$state.go('app.home', {}, {reload: true, inherit: false});
	});    	

})

.controller('HomeCtrl', function($ionicViewService) {
 	// This a temporary solution to solve an issue where the back button is displayed when it should not be.
 	// This is fixed in the nightly ionic build so the next release should fix the issue
 	$ionicViewService.clearHistory();
})

.controller('CustomerCtrl', function($scope, $state, $http, $location) {
    $scope.customers = [];
    
    $http.post('https://rederick3.aws.af.cm/posts' , {limit: 2, page:0})
        .success(function (data, status, headers, config) {
        	if(status = 200)
        		$scope.customers = data;
        	else
        		$location.path('/home');
            	
        })
        .error(function (data, status, headers, config) {
            console.log("Error occurred.  Status:" + status);
        });
})

.controller('PlaylistsCtrl', function($scope, $location, $sce, Auth, Posts) {

	if(!Auth.isLoggedIn())
		$location.path('/login')

	$scope.posts = [];

	$scope.page = 0;

	$scope.noMoreItemsAvailable = false;

	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	}

	$scope.loadMore = function(){

		var cItems = 0;

		Posts.getAll({ limit:2, page:$scope.page },
	        function(res){
	        	cItems = 2 * ($scope.page + 1);

	        	if(res.count <= cItems)
	        		$scope.noMoreItemsAvailable = true;
	        		//console.log(res.count + ' FINALLLLLLLLLLL ' + cItems)
	        	//}else{
	        		res.docs.forEach(function(x){

					  	$scope.posts.push(x);

					});


	        	//}

	        	$scope.$broadcast('scroll.infiniteScrollComplete');

	            $scope.page ++;

	        },
	        function(err) {
	                //$rootScope.error = err;
	                console.log(err)
	        });

				
	}

  /*$scope.$on('stateChangeSuccess', function() {
    $scope.loadMore();
  });*/

  

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('DashCtrl', function($scope, $stateParams) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $location, Auth, Profiles) {
	
  /*if(!Auth.isLoggedIn())
    $location.path('/login')*/

  $scope.username = 'UR';//Auth.user.username;

  $scope.educations = [];

  $scope.experiences = [];

  $scope.email = 'rederick2@hotmail.com';

  $scope.user = {};

  Profiles.getByUsername({username: $scope.username}, function(res) {

      if(res.profile){

        $scope.user = res.profile; 

        //console.log(res);

        //$scope.idProfile = res.profile.id;
        //console.log(res[0]);
        /*if(res.educations != 0){
            //console.log(res.educations);//$scope.educations = res.educations;
            res.educations.forEach(function(r){
                $scope.educations.push(r);
                //console.log(r);
            });
        }

        //console.log(res.experiences);
        if(res.experiences != 0){
            //console.log(res.educations);//$scope.educations = res.educations;
            res.experiences.forEach(function(r){
                $scope.experiences.push(r);
                //console.log(r);
            });
        }*/
      }

      //if(res.profile.dob) $scope.edad = $scope.calcular_edad(res.profile.dob);

      //$('.loading').hide();

  });
})

.controller('TabsCtrl', [ '$scope', '$state', 'Friends', function($scope, $state, Friends) {
        //$scope.navTitle = 'Tab Page';

        /*$scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.toggleMenu();
            }
        }];*/
       //$scope.friends = Friends.all();
    }]);
