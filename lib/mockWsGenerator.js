'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _binaryLiveApi = require('binary-live-api');

var _observer = require('binary-common-utils/lib/observer');

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpyWebSocket = function (_WebSocket) {
  _inherits(SpyWebSocket, _WebSocket);

  function SpyWebSocket() {
    var _Object$getPrototypeO;

    _classCallCheck(this, SpyWebSocket);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SpyWebSocket)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.respDatabase = {};
    return _this;
  }

  return SpyWebSocket;
}(_ws2.default);

var MockWsGenerator = function () {
  function MockWsGenerator(calls) {
    var _this2 = this;

    _classCallCheck(this, MockWsGenerator);

    this.calls = calls;
    this.sharedContext = {};
    this.reqRespMap = {};
    this.api = new _binaryLiveApi.LiveApi({
      websocket: SpyWebSocket
    });
    this.api.send = function (json) {
      var reqId = Math.floor(Math.random() * 1e15);
      return _this2.api.sendRaw(_this2.reqRespMap[reqId] = _extends({
        req_id: reqId
      }, json));
    };
    var originalOnMessage = this.api.socket._events.message; // eslint-disable-line no-underscore-dangle
    this.api.socket._events.message = function (rawData, flags) {
      // eslint-disable-line no-underscore-dangle
      var data = JSON.parse(rawData);
      if (!(data.req_id in _this2.reqRespMap)) {
        originalOnMessage(rawData, flags);
        return;
      }
      data.echo_req = _this2.reqRespMap[data.req_id];
      _this2.replaceSensitiveData(data);
      _observer.observer.emit('data.' + data.msg_type, data);
      originalOnMessage(rawData, flags);
    };
  }

  _createClass(MockWsGenerator, [{
    key: 'generate',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.iterateCalls(this.calls, this.api.socket.respDatabase);

              case 2:
                return _context.abrupt('return', 'module.exports = ' + JSON.stringify(this.api.socket.respDatabase).replace("'", "\\'") + ';');

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function generate() {
        return _ref.apply(this, arguments);
      }

      return generate;
    }()
  }, {
    key: 'iterateCalls',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(calls, respDatabase) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, callName, callResTypes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, callResTypeName, callDefs, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, callDefName, callDef, logger, data, _data, key, reqDef;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 3;
                _iterator = Object.keys(calls)[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 89;
                  break;
                }

                callName = _step.value;
                callResTypes = calls[callName];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 11;
                _iterator2 = Object.keys(callResTypes)[Symbol.iterator]();

              case 13:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 72;
                  break;
                }

                callResTypeName = _step2.value;
                callDefs = callResTypes[callResTypeName];

                respDatabase[callName] = !(callName in respDatabase) ? {} : respDatabase[callName];
                respDatabase[callName][callResTypeName] = !(callResTypeName in respDatabase[callName]) ? {} : respDatabase[callName][callResTypeName];
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context2.prev = 21;
                _iterator3 = Object.keys(callDefs)[Symbol.iterator]();

              case 23:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context2.next = 55;
                  break;
                }

                callDefName = _step3.value;
                callDef = callDefs[callDefName];

                callDef.func(this.api, this.sharedContext);
                logger = console;

                logger.log(callDefName);

                if (!(callResTypeName === 'subscriptions')) {
                  _context2.next = 44;
                  break;
                }

                if (!(callName === 'history')) {
                  _context2.next = 40;
                  break;
                }

                _context2.next = 33;
                return _observer.observer.register('data.history');

              case 33:
                data = _context2.sent.data;

                this.handleDataSharing(data);
                respDatabase[callName][callResTypeName][this.getKeyFromReq(data)] = {
                  data: [data]
                };
                _context2.next = 38;
                return this.observeSubscriptions('data.tick', respDatabase, callDef);

              case 38:
                _context2.next = 42;
                break;

              case 40:
                _context2.next = 42;
                return this.observeSubscriptions('data.' + callName, respDatabase, callDef);

              case 42:
                _context2.next = 52;
                break;

              case 44:
                _context2.next = 46;
                return _observer.observer.register('data.' + callName);

              case 46:
                _data = _context2.sent.data;

                this.handleDataSharing(_data);
                key = this.getKeyFromReq(_data);
                reqDef = respDatabase[callName][callResTypeName][key] = {
                  data: _data
                };
                _context2.next = 52;
                return this.iterateNext(callDef, reqDef);

              case 52:
                _iteratorNormalCompletion3 = true;
                _context2.next = 23;
                break;

              case 55:
                _context2.next = 61;
                break;

              case 57:
                _context2.prev = 57;
                _context2.t0 = _context2['catch'](21);
                _didIteratorError3 = true;
                _iteratorError3 = _context2.t0;

              case 61:
                _context2.prev = 61;
                _context2.prev = 62;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 64:
                _context2.prev = 64;

                if (!_didIteratorError3) {
                  _context2.next = 67;
                  break;
                }

                throw _iteratorError3;

              case 67:
                return _context2.finish(64);

              case 68:
                return _context2.finish(61);

              case 69:
                _iteratorNormalCompletion2 = true;
                _context2.next = 13;
                break;

              case 72:
                _context2.next = 78;
                break;

              case 74:
                _context2.prev = 74;
                _context2.t1 = _context2['catch'](11);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t1;

              case 78:
                _context2.prev = 78;
                _context2.prev = 79;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 81:
                _context2.prev = 81;

                if (!_didIteratorError2) {
                  _context2.next = 84;
                  break;
                }

                throw _iteratorError2;

              case 84:
                return _context2.finish(81);

              case 85:
                return _context2.finish(78);

              case 86:
                _iteratorNormalCompletion = true;
                _context2.next = 5;
                break;

              case 89:
                _context2.next = 95;
                break;

              case 91:
                _context2.prev = 91;
                _context2.t2 = _context2['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context2.t2;

              case 95:
                _context2.prev = 95;
                _context2.prev = 96;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 98:
                _context2.prev = 98;

                if (!_didIteratorError) {
                  _context2.next = 101;
                  break;
                }

                throw _iteratorError;

              case 101:
                return _context2.finish(98);

              case 102:
                return _context2.finish(95);

              case 103:
                return _context2.abrupt('return');

              case 104:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 91, 95, 103], [11, 74, 78, 86], [21, 57, 61, 69], [62,, 64, 68], [79,, 81, 85], [96,, 98, 102]]);
      }));

      function iterateCalls(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return iterateCalls;
    }()
  }, {
    key: 'observeSubscriptions',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(event, respDatabase, callDef) {
        var promise, forever, resp, data, key, messageType, resps, reqDef, finished;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _observer.observer.register(event);

              case 2:
                promise = _context3.sent;
                forever = true;

              case 4:
                if (!forever) {
                  _context3.next = 26;
                  break;
                }

                _context3.next = 7;
                return promise;

              case 7:
                resp = _context3.sent;
                data = resp.data;
                key = this.getKeyFromReq(data);
                messageType = data.msg_type === 'tick' ? 'history' : data.msg_type;
                resps = respDatabase[messageType].subscriptions;

                if (!(key in resps)) {
                  resps[key] = {
                    data: []
                  };
                }
                reqDef = resps[key];

                this.handleDataSharing(data);
                finished = this.handleSubscriptionLimits(data, reqDef.data, callDef);

                if (!finished) {
                  _context3.next = 23;
                  break;
                }

                delete this.reqRespMap[data.req_id];
                _context3.next = 20;
                return this.iterateNext(callDef, reqDef);

              case 20:
                return _context3.abrupt('break', 26);

              case 23:
                promise = resp.next;

              case 24:
                _context3.next = 4;
                break;

              case 26:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function observeSubscriptions(_x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return observeSubscriptions;
    }()
  }, {
    key: 'iterateNext',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(callDef, reqDef) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!callDef.next) {
                  _context4.next = 4;
                  break;
                }

                reqDef.next = {};
                _context4.next = 4;
                return this.iterateCalls(callDef.next, reqDef.next);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function iterateNext(_x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return iterateNext;
    }()
  }, {
    key: 'handleSubscriptionLimits',
    value: function handleSubscriptionLimits(data, defData, callDef) {
      defData.push(data);
      if (defData.length === callDef.maxResponse || callDef.stopCondition && callDef.stopCondition(data)) {
        return true;
      }
      return false;
    }
  }, {
    key: 'handleDataSharing',
    value: function handleDataSharing(data) {
      if (data.msg_type === 'proposal') {
        this.sharedContext.contract = data.proposal;
      } else if (data.msg_type === 'proposal' && !data.error) {
        if (data.buy.shortcode.indexOf('DIGITEVEN') >= 0) {
          this.sharedContext.evenPurchasedContract = data.buy.contract_id;
        } else {
          this.sharedContext.oddPurchasedContract = data.buy.contract_id;
        }
      }
    }
  }, {
    key: 'replaceSensitiveData',
    value: function replaceSensitiveData(data) {
      if (data.msg_type === 'authorize' && !data.error) {
        data.authorize.loginid = 'VRTC1234567';
        data.authorize.email = 'root@localhost.localdomain';
      }
    }
  }, {
    key: 'getKeyFromReq',
    value: function getKeyFromReq(data) {
      return JSON.stringify(this.reqRespMap[data.req_id]);
    }
  }]);

  return MockWsGenerator;
}();

exports.default = MockWsGenerator;