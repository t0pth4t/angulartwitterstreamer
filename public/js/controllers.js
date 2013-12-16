'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }).
  controller('MyCtrl1', function ($scope, socket) {

    socket.on('data',function(data){
      $scope.recentPackerTweets = data.recentPackerTweets;
      $scope.recentCowboyTweets = data.recentCowboyTweets;
      $scope.total = data.total;
      $scope.totalPackers = data.totalPackers;
      $scope.totalCowboys = data.totalCowboys;
      $scope.lastUpdated = data.lastUpdated;
      $scope.symbols = data.symbols;
      var total = data.lastUpdated;
      for(var key in data.symbols){
        var val = data.symbols[key] / total;
        if(isNaN(val)){
          val = 0;
        }

      }
    })
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
