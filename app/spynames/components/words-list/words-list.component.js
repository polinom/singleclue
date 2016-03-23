var template = require('./words-list.html');

angular.module('spynames').directive('wordsList', function (dataService, $firebaseArray) {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'wordsList',
    controller: function ($scope) {
      var nounsRef = dataService.getRootRef().child('nouns');
      $scope.words = $firebaseArray(nounsRef);
      $scope.newWord = '';

      $scope.words.$loaded(function() {console.log('loaded')});

      $scope.addWord = function () {
        $scope.words.$add($scope.newWord);
        $scope.newWord = '';
      };

    }
  }
});
