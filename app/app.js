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

.controller('HomeCtrl', ['$scope', function ($scope) {
    $scope.message = 'we made it';  
}])

.controller('ResumesCtrl', ['$scope', 'api', function ($scope, api) {

    $scope.uploadResume = function() {
        var file        = document.getElementById('upload').files[0]
        ,   reader      = new FileReader()
        ;

        reader.onloadend = function(e){
            var bytes = e.target.result;

            api.upload({
                file : bytes
            ,   name : file.name
            }, function(res) {
                console.log('file uploaded');
                console.log(res);
            });
        }

        reader.readAsBinaryString(file);
    }
}])

.controller('LoginCtrl', ['$scope', 'api', function ($scope, api) {
    $scope.email    = '';
    $scope.password = '';

    $scope.loginUser = function() {
        api.login({
            email       : $scope.email
        ,   password    : $scope.password
        }, function(res) {
            console.log('logged in');
            console.log(res);
        });
    }
}])

.controller('RegisterCtrl', ['$scope', 'api', function($scope, api) {
    $scope.firstName    = '';
    $scope.lastName     = '';
    $scope.email        = '';
    $scope.password     = '';

    $scope.saveUser = function() {
        api.register({
            firstName   : $scope.firstName
        ,   lastName    : $scope.lastName
        ,   email       : $scope.email
        ,   password    : $scope.password
        }, function(res) {
            console.log('user saved');
            console.log(res);
        });
    }
}])

.factory('api', ['$resource', function($resource) {
    return {
        register    : $resource('/api/register').save
    ,   login       : $resource('/api/login').save
    ,   upload      : $resource('/api/upload').save
    }
}])

