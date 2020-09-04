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
  $scope.currentModifier = [];
  $scope.isEditMode = true;
  $http.get("myKeys.json").then(mySuccess, myError);//Fetch JSON
  
  // Key loggers
  document.onkeydown = function(e) {
    // console.log("down key: ", e.key);
    $scope.addModifier(e);
    $scope.setLayoutByModifierPriority($scope.currentModifier);
  };

  document.onkeyup = function(e) {
    // console.log("up key: ", e.key);
    $scope.removeModifier(e);
    $scope.setLayoutByModifierPriority($scope.currentModifier);
  };

  // Modifiers stacks management
  $scope.addModifier = function(e) {
    if (e.key == "Shift")
      $scope.currentModifier.push("Shift");
    if (e.key == "Control")
      $scope.currentModifier.push("Ctrl");
    if (e.key == "Alt" || e.key == "Meta")
      $scope.currentModifier.push("Alt");
    console.log("down mod:", $scope.currentModifier);
  }

  $scope.removeModifier = function(e) {
    if (e.key == "Shift")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Shift");
    if (e.key == "Control")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Ctrl");
    if (e.key == "Alt" || e.key == "Meta")
      $scope.currentModifier = $scope.currentModifier.filter(f => f !== "Alt");
    // console.log("up mod:", $scope.currentModifier);
  }

  // Determine modifier priority
  $scope.setLayoutByModifierPriority = function(modifiers) {
    if (modifiers.includes("Shift")) {
      $scope.currentLayout = $scope.myData.data.shiftLayout;
    } else if (modifiers.includes("Ctrl")) {
      $scope.currentLayout = $scope.myData.data.ctrlLayout;
    } else if (modifiers.includes("Alt")) {
      $scope.currentLayout = $scope.myData.data.altLayout;
    } else {
      $scope.currentLayout = $scope.myData.data.defaultLayout;
    }
    $scope.$apply();
  }

  $scope.getCurrentLayout = function(modifiers) {
    if (modifiers.includes("Shift")) {
      return $scope.myData.data.shiftLayout.layout;
    } else if (modifiers.includes("Ctrl")) {
      return $scope.myData.data.ctrlLayout.layout;
    } else if (modifiers.includes("Alt")) {
      return $scope.myData.data.altLayout.layout;
    } else
      return $scope.myData.data.defaultLayout.layout;
  }

  $scope.changeLayoutViaSelect = function(selectOption) {
    console.log('LKSJDFLKJSDLFKJSLDKFJSLDKFJSLDKFJ', selectOption);
  }

  $scope.myChange = function(key, row, col) {//RENAME PLZ
    console.log("change[%d][%d] to '%s' on %s layout", row, col, key, $scope.currentLayout.name);
    $scope.currentLayout.layout[row][col] = key;
    //console.log("penzo - ", $scope.currentLayout.layout);
  }
  
  // fetching .json functions
  function mySuccess(response) {
    $scope.myData = response;// should i use response.data instead ??
    $scope.myLen = Object.keys($scope.myData.data.defaultLayout.layout[0]).length;// kinda dirty, i should maybe find the longest row.
    $scope.currentLayout = $scope.myData.data.defaultLayout;
    console.log("SUCCESS PARSING JSON !!!!", Object.keys($scope.myData.data));
    let myArray = [];
    angular.forEach(response.data, function(value, key) {
      console.log("array", value, key);
      myArray.push(value);
    });
  };

  function myError(error) {
    console.error("my error", error);
  }
}]);