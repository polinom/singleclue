var template = require('./join-game.html');

angular.module('spynames').directive('joinGame', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'joinGame',
    controller: function ($scope, $state) {

        $scope.code = '';

        $scope.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        $scope.buttonJoinGame = function () {
          if ($scope.code.length === 4 && $scope.isNumber($scope.code)) {
             $state.go('spyCard', {'code': $scope.code});
          } else {
              $scope.error = 'Please enter 4 digit code of the existing game.'
          }
        }
    }
  }
});
