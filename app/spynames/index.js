var angular = require('angular');
require('firebase');
require('angularfire');
//require('ngCordova');
require('angular-ui-router');
require('lodash');

angular.module('spynames', ['ui.router', 'firebase']);

// import components
require('./components/game-table/game-table.component');
require('./components/start-join/start-join.component');
require('./components/join-game/join-game.component');
require('./components/spy-card/spy-card.component');
require('./components/words-details/word-details.component');
require('./components/words-list/words-list.component');

// import services
require('./services/dataService');

// filters
require('./filters/stringFilters');


module.exports = angular.module('spynames').config(function ($urlRouterProvider, $stateProvider) {

  $stateProvider
    .state('joinGame', {
      url: '/join',
      template: '<join-game></join-game>'
    })
    .state('spyCard', {
      url: '/spy/:code',
      template: '<spy-card></spy-card>'
    })
    .state('start', {
      url: '/start',
      template: '<start-join></start-join>'
    })
    .state('gameTable', {
      url: '/table/:code',
      template: '<game-table></game-table>'
    })
    .state('words', {
      url: '/words',
      template: '<words-list></words-list>'
    })
    .state('wordDetails', {
      url: '/words/:wordId',
      template: '<word-details></word-details>'
    });

  $urlRouterProvider.otherwise("/");
});

require('./css/style.css');

