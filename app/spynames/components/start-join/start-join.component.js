var template =  require('./start-join.html');
angular.module('spynames').directive('startJoin', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'startJoin',
    controller: function ($scope, $stateParams, $state, $interval, gameService) {

      var colors = {'red': 9, 'blue': 8, 'citizen': 7, 'assassin': 1};

      this.miniCards = _.shuffle(_.range(25).map(function (num) {
          if (colors.red) {
              colors.red -= 1;
              return {color: 'red'};
          } else if (colors.blue) {
              colors.blue -= 1;
              return {color: 'blue'}
          } else if (colors.citizen) {
              colors.citizen -= 1;
              return {color: 'citizen'}
          } else if (colors.assassin) {
              colors.assassin -= 1;
              return {color: 'assassin'}
          }
      }));

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
