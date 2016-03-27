var _ = require('lodash');

angular.module('spynames').
    constant('FIREBASE_ENDPOINT', "https://spynames.firebaseio.com").
    factory('dataService', function (FIREBASE_ENDPOINT) {
        return {
            'getRootRef' : function () {
                return new Firebase(FIREBASE_ENDPOINT);
            }
        };
    }).

    factory('gameService', function (FIREBASE_ENDPOINT, dataService, $http, $firebaseObject) {

    var Game = $firebaseObject.$extend({
        getCardColor: function (color) {
            return this.cards ? this.cards.filter(function (card) { return card.color === color;}) : [];
        }
    });

    return {
        'getGame': function (code) {
            return new Game(dataService.getRootRef().child('games/' + code));
        },

        'createGame' : function (code) {
            if (!code) {
              code = this.getRandomInt(1000, 9999);
            }
            var that = this;
            return this.getAllCards().then(function (resp) {
                var allCards = _.map(resp.data, function (val, key) {return {'name': val, 'id': key}});
                var cards = that.getRandom25Cards(allCards);
                var game = that.getGame(code);

                game.code = code.toString();
                game.createdAt = new Date();
                game.cards = cards;
                game.whosTurn = 'red';
                game.blueAgent = false;
                game.redAgent = false;
                game.gameDone = false;
                game.winner = null;
                game.cardsOpened = {
                    'blue': 8,
                    'red': 9,
                    'assassin': 1,
                    'citizen': 7
                };
                game.$save();
                return code.toString();
            });
        },

        'getAllCards': function () {
            return $http({method: 'GET', url: FIREBASE_ENDPOINT + '/nouns.json'});
        },

        'getRandom25Cards': function (availableCards) {
              console.log(_);

              var redCards = _.sampleSize(availableCards, 9);
              redCards.forEach(function (card) { card.color = 'red' });

              availableCards = _.filter(availableCards, function (card) {
                  return !_.includes(redCards, card);
              });

              var blueCards = _.sampleSize(availableCards, 8);
              blueCards.forEach(function (card) { card.color = 'blue' });

              availableCards = _.filter(availableCards, function (card) {
                  return !_.includes(blueCards, card);
              });

              var blackCard = _.sampleSize(availableCards, 1);
              blackCard.forEach(function (card) { card.color = 'assassin' });

              availableCards = _.filter(availableCards, function (card) {
                  return !_.includes(blackCard, card);
              });

              var sitizenCards = _.sampleSize(availableCards, 7);
              sitizenCards.forEach(function (card) { card.color = 'citizen' });

              var allCards = redCards.concat(blueCards, blackCard, sitizenCards);

              return _.shuffle(allCards);
        },

        'getRandomInt': function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
    });
