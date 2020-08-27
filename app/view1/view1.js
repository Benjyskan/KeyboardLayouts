'use strict';
//               GOOD LINK FOR KEY EVENTS           
// https://groups.google.com/g/angular/c/vXqVOKcwA7M?pli=1
//
angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {
  $http.get("myKeys.json").then(mySuccess, myError);
  $scope.currentModifier = [];
  
  // Key loggers
  document.onkeydown = function(e) {
    console.log("down key: ", e.key);
    if (e.key == "Shift")
      $scope.currentModifier.push("Shift");
    if (e.key == "Control")
      $scope.currentModifier.push("Ctrl");
    if (e.key == "Alt" || e.key == "Meta")
      $scope.currentModifier.push("Alt");
    console.log("down mod:", $scope.currentModifier);
    $scope.getLayoutPriority($scope.currentModifier);
  };

  document.onkeyup = function(e) {
    console.log("up key: ", e.key);
    if (e.key == "Shift")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Shift");
    if (e.key == "Control")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Ctrl");
    if (e.key == "Alt" || e.key == "Meta")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Alt");
    console.log("up mod:", $scope.currentModifier);
    $scope.getLayoutPriority($scope.currentModifier);
  };

  // Determine modifier priority
  $scope.getLayoutPriority = function(modifiers) {
    if (modifiers.includes("Shift")) {
      $scope.currentLayout = $scope.myData.data.shiftLayer;
    } else if (modifiers.includes("Ctrl")) {
      $scope.currentLayout = $scope.myData.data.ctrlLayer;
    } else if (modifiers.includes("Alt")) {
      $scope.currentLayout = $scope.myData.data.altLayer;
    } else
      $scope.currentLayout = $scope.myData.data.keyboard1;
    $scope.$apply();
  }
  
  // fetching .json functions
  function mySuccess(response) {
    $scope.myData = response;
    $scope.myLen = Object.keys($scope.myData.data.keyboard1.row1).length;// kinda dirty
    $scope.currentLayout = $scope.myData.data.keyboard1;
  };

  function myError(error) {
    console.error("my error", error);
  }
}]);