var _ = require('lodash');

angular.module('spynames').
    constant('FIREBASE_ENDPOINT', "https://spynames.firebaseio.com").
    constant('COLORS', ['blue', 'green', 'orange', 'red']).
    factory('dataService', function (FIREBASE_ENDPOINT) {
        return {
            'getRootRef' : function () {
                return new Firebase(FIREBASE_ENDPOINT);
            }
        };
    }).

    factory('gameService', function (FIREBASE_ENDPOINT, dataService, $http, $firebaseObject, COLORS) {

    var Game = $firebaseObject.$extend({
        getCardColor: function (color) {
            return this.cards ? this.cards.filter(function (card) { return card.color === color;}) : [];
        }
    });

    return {

        'counters': {},

        'getGame': function (code) {
            return new Game(dataService.getRootRef().child('games/' + code));
        },

        'createGame' : function (code, teams) {
            if (!code) {
              code = this.getRandomInt(1000, 9999);
            }
            var cardsPerPlayer = 24 / teams;

            var that = this;
            return this.getAllCards().then(function (resp) {
                var allCards = _.map(resp.data, function (val, key) {return {'name': val, 'id': key}});
                var cards = that.getRandom25Cards(allCards, cardsPerPlayer);
                var game = that.getGame(code);
                game.code = code.toString();
                game.createdAt = new Date();
                game.cards = cards;
                game.whosTurn = 'blue';
                game.gameDone = false;
                game.winner = null;
                game.cardsOpened = that.counters;
                game.teams = teams;
                game.$save();
                return code.toString();
            });
        },

        'getAllCards': function () {
            return $http({method: 'GET', url: FIREBASE_ENDPOINT + '/nouns.json'});
        },

        'getRandom25Cards': function (availableCards, cardsPerPlayer) {

             var cardsRemained = 24,
                 allCards = [],
                 that = this;

             COLORS.forEach(function (color) {

                 if (cardsRemained) {

                     that.counters[color] = cardsPerPlayer;

                     var colorCards = _.sampleSize(availableCards, cardsPerPlayer);

                     colorCards.forEach(function (card) {
                         card.color = color;
                         cardsRemained--
                     });

                     availableCards = _.filter(availableCards, function (card) {
                         return !_.includes(colorCards, card);
                     });

                     allCards = allCards.concat(colorCards);
                 }
             });

             return _.shuffle(allCards);
        },

        'getRandomInt': function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
    });
