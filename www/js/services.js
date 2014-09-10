angular.module('starter.services', ['http-auth-interceptor'])

/**
 * A simple example service that returns some data.
 */
 .factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend) {
  var service = {
    login: function(user) {
      $http.post(routingConfig.URL + '/login', user, { ignoreAuthModule: true })
      .success(function (data, status, headers, config) {
        $http.defaults.headers.common.Authorization = "NjMwNjM4OTQtMjE0Mi00ZWYzLWEzMDQtYWYyMjkyMzNiOGIy"  // Step 1
        console.log(data);
      // Need to inform the http-auth-interceptor that
        // the user has logged in successfully.  To do this, we pass in a function that
        // will configure the request headers with the authorization token so
        // previously failed requests(aka with status == 401) will be resent with the
        // authorization token placed in the header
        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
          config.headers.Authorization = "NjMwNjM4OTQtMjE0Mi00ZWYzLWEzMDQtYWYyMjkyMzNiOGIy";
          return config;
        });
      })
      .error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', status);
      });
    },
    logout: function(user) {
      $http.post('https://logout', {}, { ignoreAuthModule: true })
      .finally(function(data) {
        delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
      });     
    },  
    loginCancelled: function() {
      authService.loginCancelled();
    }
  };
  return service;
})

 .factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $cookieStore.remove('user');

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            //console.log('USERSSSS: ' + user);
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success(res);
            }).error(error);
        },
        remove: function(user, success, error) {

            console.log(user);

            $http.post('/remove', user).success(function(res) {
                //changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post(routingConfig.URL + '/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        loginFb: function(user, success, error) {
            $http.post('/auth/facebook', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
})

.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get(routingConfig.URL + '/users').success(success).error(error);
        },
        query: function(data, success, error) {
            $http.post(routingConfig.URL + '/users/query', data).success(success).error(error);
        },
        getUsers: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/users/get', data).success(success).error(error);
        },
        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/users/getbyusername', data).success(success).error(error);
        },
        update: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/users/update', data).success(success).error(error);
        },
        addMessage: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/users/messages/add', data).success(success).error(error);
        }

    };
})

.factory('Profiles', function($http) {
    return {
        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/getbyusername', data).success(success).error(error);
        },
        update: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/update', data).success(success).error(error);
        },
        getEducations: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/getEducations', data).success(success).error(error);
        },
        updateEducation: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/updateEducation', data).success(success).error(error);
        },
        removeEducation: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/removeEducation', data).success(success).error(error);
        },
        addEducation: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/addEducation', data).success(success).error(error);
        },
        getExperiences: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/getExperiences', data).success(success).error(error);
        },
        updateExperience: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/updateExperience', data).success(success).error(error);
        },
        removeExperience: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/removeExperience', data).success(success).error(error);
        },
        addExperience: function(data, success, error) {
            //console.log(sort);
            $http.post(routingConfig.URL + '/profile/addExperience', data).success(success).error(error);
        }

    };
})

.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('Posts', function($http) {
    return {
        getAll: function(data, success, error) {
            console.log(data);
            $http.post(routingConfig.URL + '/posts', data, { ignoreAuthModule: true }).success(success).error(error);
        },
        add: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/add', data).success(success).error(error);
        },

        remove: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/remove', data).success(success).error(error);
        },

        addComment: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/add/comment', data).success(success).error(error);
        },

        removeComment: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/remove/comment', data).success(success).error(error);
        },

        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/getbyusername', data).success(success).error(error);
        },

        getComments: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/getcomments', data).success(success).error(error);
        }

    };
});

