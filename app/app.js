'use strict';

var app = angular.module('dashboard', ['ui.router', 'ngResource'])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
        url             : '/home'
    ,   templateUrl     : 'views/home.html'
    ,   controller      : 'HomeCtrl'
    })
    .state('resumes', {
        url             : '/resumes'
    ,   templateUrl     : 'views/resumes.html'
    ,   controller      : 'ResumesCtrl'
    })
    // redirect for slugo
    .state('slugo', {
        url             : '/slugo'
    ,   templateUrl     : 'views/slugo.html'
    })
    .state('login', {
        url             : '/login'
    ,   templateUrl     : 'views/login.html'
    ,   controller      : 'LoginCtrl'
    })
    .state('register', {
        url             : '/register'
    ,   templateUrl     : 'views/register.html'
    ,   controller      : 'RegisterCtrl'
    })
    ;
    $urlRouterProvider.otherwise('/home');
}])

.controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}])

.controller('HomeCtrl', ['$scope', function ($scope, $http) {
    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // }); 
}])

.controller('ResumesCtrl', ['$scope', function ($scope) {
    $scope.message = 'we made it';   
}])

.controller('LoginCtrl', ['$scope', function ($scope) {
    $scope.credentials = {
        username : ''
    ,   password : ''
    }
}])

.controller('RegisterCtrl', ['$scope', 'RegisterUser', function($scope, RegisterUser) {
    $scope.firstName    = '';
    $scope.lastName     = '';
    $scope.email        = '';
    $scope.password     = '';

    $scope.saveUser = function() {
        RegisterUser({
            firstName   : $scope.firstName
        ,   lastName    : $scope.lastName
        ,   email       : $scope.email
        ,   password    : $scope.password
        }, function(data) {
            console.log('user saved');
            console.log(data);
        });
    }
}])

.factory('RegisterUser', ['$resource', function($resource) {
    return $resource('/api/register').save;
}])
