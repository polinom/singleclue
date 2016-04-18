var template = require('./rules.html');

angular.module('spynames').directive('rules', function () {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'rules',
    controller: function ($scope) {
        console.log('rules loaded in controller')
    }
  }
});
