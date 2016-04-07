var template =  require('./start-join.html');
angular.module('spynames').directive('startJoin', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'startJoin',
    controller: function ($scope, $stateParams, $state, $interval, gameService) {

        $scope.code = '';

        $scope.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        $scope.buttonJoinGame = function () {
          if ($scope.code.length === 4 && $scope.isNumber($scope.code)) {
             $state.go('spyCard', {'code': $scope.code});
          } else {
              $scope.error = 'Please enter a 4 digit code of an existing game.'
          }
        };

        this.startGame = function (players) {
            gameService.createGame(null, players).then(function (code) {
                $state.go('gameTable', {'code': code})
            })
        };
    }
  }
});
