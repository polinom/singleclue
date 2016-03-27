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
              $scope.error = 'Please enter 4 digit code of the existing game.'
          }
        };

        var that = this;
        this.startAnimation = function () {
          this.animationPrms = $interval(function () {
              that.miniCards = _.shuffle(that.miniCards);
          }, 100)
        };

        this.startAnimation();

        this.startGame = function () {
            $interval.cancel(this.animationPrms);
            gameService.createGame().then(function (code) {
                $state.go('gameTable', {'code': code})
            })
        };
    }
  }
});
