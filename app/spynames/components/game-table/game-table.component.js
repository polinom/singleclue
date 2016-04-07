var template =  require('./game-table.html');
angular.module('spynames').directive('gameTable', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'gameTable',
    controller: function ($scope, $stateParams, $state, $timeout, gameService, COLORS) {

      $scope.game = gameService.getGame($stateParams.code);

      $scope.resetGameState = function () {
          if ($scope.prms) {
              $timeout.cancel($scope.prms);
          }
      };

      $scope.restartGame = function () {
        $scope.resetGameState();
        gameService.createGame($stateParams.code, $scope.game.teams);
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

        console.log('game ends = ');
        console.log($scope.isGameEndCondition());

        $scope.game.winner = $scope.isGameEndCondition();

        if ($scope.game.winner) {
           $scope.game.gameDone = true;
           $scope.flashWinner($scope.game.winner);
        }

        // if current user did not pick his color than turn changes
        if ($scope.game.whosTurn !== card.color) {
            $scope.game.whosTurn = $scope.getNextColor();
        }
      };

      $scope.getNextColor = function () {
          var nextIndex = (COLORS.indexOf($scope.game.whosTurn) + 1) % $scope.game.teams;
          return COLORS[nextIndex];
      };

    /**
     * Returns color of the winner or null
     * @returns {*}
     */
      $scope.isGameEndCondition = function () {
          var winner = null;
          COLORS.forEach(function(color) {
              if ($scope.game.cardsOpened[color] === 0) {
                  winner = color;
              }
          });
          return winner;
      }
    }
  }
});
