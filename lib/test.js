'use strict';

var _binaryLiveApi = require('binary-live-api');

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = new _binaryLiveApi.LiveApi({ websocket: _ws2.default });

api.events.on('tick', function (r) {
  console.log(r);
});
api.getTickHistory('R_100', {
  "end": "latest",
  "count": 600,
  "subscribe": 1
});