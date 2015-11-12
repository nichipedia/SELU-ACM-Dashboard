'use strict';

var app = angular.module('dashboard', ['ui.router', 'ngResource'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
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
        .state('slugo', {
            // redirect for slugo
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

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/home');
}])

.controller('NavCtrl', ['$scope', '$window', '$location', function ($scope, $window, $location) {
    $scope.isActive = function (viewLocation) {
        $scope.isLoggedIn = $window.sessionStorage['token'];
        $('.collapse').collapse('hide');
        return viewLocation === $location.path();
    }

    $scope.logout = function () {
        $window.sessionStorage['token'] = '';
    }
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

.controller('LoginCtrl', ['$scope', '$window', '$location', 'api', function ($scope, $window, $location, api) {
    $scope.email    = '';
    $scope.password = '';

    $scope.loginUser = function () {
        api.login({
            email       : $scope.email
        ,   password    : $scope.password
        }, function (res) {
            $window.sessionStorage['firstName']     = res.user.firstName;
            $window.sessionStorage['lastName']      = res.user.lastName;
            $window.sessionStorage['email']         = res.user.email;
            $window.sessionStorage['token']         = res.token;
            $location.path('/home');
        });
    }
}])

.controller('RegisterCtrl', ['$scope', 'api', function ($scope, api) {
    $scope.firstName    = '';
    $scope.lastName     = '';
    $scope.email        = '';
    $scope.password     = '';

    $scope.saveUser = function () {
        api.register({
            firstName   : $scope.firstName
        ,   lastName    : $scope.lastName
        ,   email       : $scope.email
        ,   password    : $scope.password
        }, function (res) {
            console.log('user saved');
            console.log(res);
        });
    }
}])

.factory('api', ['$resource', function ($resource) {
    return {
        register    : $resource('/api/register').save
    ,   login       : $resource('/api/login').save
    ,   upload      : $resource('/api/upload').save
    }
}])

