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
  // Init
  $http.get("myKeys.json").then(mySuccess, myError);//Fetch JSON
  $scope.currentModifier = [];
  $scope.isEditMode = false;
  
  // Key loggers
  document.onkeydown = function(e) {
    // console.log("down key: ", e.key);
    $scope.addModifier(e);
    $scope.setLayoutByPriority($scope.currentModifier);
  };

  document.onkeyup = function(e) {
    // console.log("up key: ", e.key);
    $scope.removeModifier(e);
    $scope.setLayoutByPriority($scope.currentModifier);
  };

  $scope.addModifier = function(e) {
    if (e.key == "Shift")
      $scope.currentModifier.push("Shift");
    if (e.key == "Control")
      $scope.currentModifier.push("Ctrl");
    if (e.key == "Alt" || e.key == "Meta")
      $scope.currentModifier.push("Alt");
    // console.log("down mod:", $scope.currentModifier);
  }

  $scope.removeModifier = function(e) {
    if (e.key == "Shift")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Shift");
    if (e.key == "Control")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Ctrl");
    if (e.key == "Alt" || e.key == "Meta")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Alt");
    console.log("up mod:", $scope.currentModifier);
  }

  // Determine modifier priority
  $scope.setLayoutByPriority = function(modifiers) {
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

  $scope.myChange = function(key, row, myId) {
    console.log("Changed, key: %c%s%c, row: %o, TEST:",
      "color:green", key, "color:black", row.length, myId);
    console.log("penzo - ", $scope.currentLayout);
    // $scope.currentLayout[row] = key;
    console.log('ouech:', document.getElementById(myId));
  }
  
  // fetching .json functions
  function mySuccess(response) {
    $scope.myData = response;
    $scope.myLen = Object.keys($scope.myData.data.keyboard1[0]).length;// kinda dirty, i should maybe find the longest row.
    $scope.currentLayout = $scope.myData.data.keyboard1;
  };

  function myError(error) {
    console.error("my error", error);
  }
}]);