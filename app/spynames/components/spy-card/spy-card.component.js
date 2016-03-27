var template = require('./spy-card.html');

angular.module('spynames').directive('spyCard', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'spyCard',
    controller: function ($scope, $stateParams, $state, gameService, $timeout) {
      $scope.game = gameService.getGame($stateParams.code);

      $scope.game.$loaded().then(function () {
        if (!$scope.game.code) {
              $state.go('start');
        }
      });

      $scope.resetGameState = function () {
          if ($scope.prms) {
              $timeout.cancel($scope.prms);
          }
      };

      $scope.game.$watch(function () {
        if ($scope.game.gameDone) {
           if ($scope.game.winner) {
             $scope.flashWinner($scope.game.winner)
           } else {
             resetGameState()
           }
        }
      });

      $scope.flashWinner = function (color) {
          lightOff = function (mlsec) {
              $scope.game.whosTurn = null;
              $scope.prms1 = $timeout(function () {lightOn(color, 200);}, mlsec)
          };
          lightOn = function (color, mlsec) {
              $scope.game.whosTurn = color;
              $scope.prms2 = $timeout(function () {lightOff(200);}, mlsec)
          };
          lightOn();
      };

    }
  }
});
