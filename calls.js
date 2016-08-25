'use strict';
module.exports = {
  history: {
    // errors: {}
    // responses: {}
    subscriptions: {
      r_100: {
        func: function r_100(api) {
          api.getTickHistory('R_100', {
            "end": "latest",
            "count": 600,
            "subscribe": 1
          });
        },
        maxResponse: 4, // optional
        stopCondition: function(data) { // optional
          // return true to stop saving the stream 
          return false;
        },
      }
    },
  },
  authorize: {
    // subscriptions: {}
    // responses: {}
    errors: {
      InvalidToken: {
        func: function InvalidToken(api) {
          api.authorize('FakeToken');
        },
        next: {
          active_symbols: {
            // subscriptions: {}
            // errors: {}
            responses: {
              allActiveSymbols: {
                func: function allActiveSymbols(api) {
                  api.getActiveSymbolsBrief();
                },
              },
            },
          },
        },
      },
    },
  },
};
