var template = require('./spy-card.html');

angular.module('spynames').directive('spyCard', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'spyCard',
    controller: function ($scope, $stateParams, $state, gameService) {
      $scope.game = gameService.getGame($stateParams.code);
      $scope.game.$loaded().then(function () {
        if (!$scope.game.code) {
              $state.go('joinGame');
        }
      });
    }
  }
});
