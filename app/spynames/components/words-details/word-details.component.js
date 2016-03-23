var template = require('./word-details.html');

angular.module('spynames').directive('wordDetails', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'wordDetails',
    controller: function ($scope, $stateParams) {

      $scope.word = {};

      $scope.save = function () {
        Words.update({_id: $stateParams.wordId}, {
          $set: {
            name: $scope.word.name,
            description: this.word.description
          }
        }, function (error) {
          if (error) {
            console.log('Oops, unable to update the word...');
          }
          else {
            console.log('Done!');
          }
        });
      };
    }
  }
});
