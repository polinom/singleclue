var template =  require('./game-table.html');
angular.module('spynames').directive('gameTable', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'gameTable',
    controller: function ($scope, $stateParams, $state, $timeout, gameService) {

      $scope.game = gameService.getGame($stateParams.code);

      $scope.resetGameState = function () {
          if ($scope.prms) {
              $timeout.cancel($scope.prms);
          }
      };

      $scope.restartGame = function () {
        $scope.resetGameState();
        gameService.createGame($stateParams.code);
        $scope.game.$save()
      };

      $scope.flashWinner = function (color) {
          lightOff = function (mlsec) {
              $scope.game.whosTurn = null;
              $scope.prms = $timeout(function () {lightOn(color, 200);}, mlsec)
          };
          lightOn = function (color, mlsec) {
              $scope.game.whosTurn = color;
              $scope.prms = $timeout(function () {lightOff(200);}, mlsec)
          };
          lightOn();
      };

      $scope.openCard = function (card) {
        card.opened = true;
        if ($scope.game.gameDone) {
            return;
        }
        $scope.game.cardsOpened[card.color] -= 1;
        $scope.changeState(card);
        $scope.game.$save(); // remove this line if you don't want sync board state
      };

      $scope.changeState = function (card) {

        console.log($scope.game.winner);

        $scope.game.winner = $scope.isGameEndCondition();

        if ($scope.game.winner) {
           $scope.game.gameDone = true;
           $scope.flashWinner($scope.game.winner);
        }

        // if current user did not pick his collor than turn changes
        if ($scope.game.whosTurn !== card.color) {
            $scope.game.whosTurn = $scope.game.whosTurn === 'blue'?'red':'blue';
        }
      };

      $scope.isGameEndCondition = function () {
          if (!$scope.game.cardsOpened['red']) {
              return 'red';
          } else if (!$scope.game.cardsOpened['blue']) {
              return 'blue';
          } else if (!$scope.game.cardsOpened['assassin']) {
              return $scope.game.whosTurn === 'blue'?'red':'blue';
          }
          return null;
      }
    }
  }
});
