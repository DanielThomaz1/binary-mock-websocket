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
        var _this3 = this;

        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 3;
                _loop = regeneratorRuntime.mark(function _loop() {
                  var callName, callResTypes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, callResTypeName, callDefs, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, callDefName, callDef, logger, data, _data, key, reqDef;

                  return regeneratorRuntime.wrap(function _loop$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          callName = _step.value;
                          callResTypes = calls[callName];
                          _iteratorNormalCompletion2 = true;
                          _didIteratorError2 = false;
                          _iteratorError2 = undefined;
                          _context2.prev = 5;
                          _iterator2 = Object.keys(callResTypes)[Symbol.iterator]();

                        case 7:
                          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context2.next = 66;
                            break;
                          }

                          callResTypeName = _step2.value;
                          callDefs = callResTypes[callResTypeName];

                          respDatabase[callName] = !(callName in respDatabase) ? {} : respDatabase[callName];
                          respDatabase[callName][callResTypeName] = !(callResTypeName in respDatabase[callName]) ? {} : respDatabase[callName][callResTypeName];
                          _iteratorNormalCompletion3 = true;
                          _didIteratorError3 = false;
                          _iteratorError3 = undefined;
                          _context2.prev = 15;
                          _iterator3 = Object.keys(callDefs)[Symbol.iterator]();

                        case 17:
                          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context2.next = 49;
                            break;
                          }

                          callDefName = _step3.value;
                          callDef = callDefs[callDefName];

                          callDef.func(_this3.api, _this3.sharedContext);
                          logger = console;

                          logger.log(callDefName);

                          if (!(callResTypeName === 'subscriptions')) {
                            _context2.next = 38;
                            break;
                          }

                          if (!(callName === 'history')) {
                            _context2.next = 34;
                            break;
                          }

                          _context2.next = 27;
                          return new Promise(function (r) {
                            return _observer.observer.register('data.history', r, true);
                          });

                        case 27:
                          data = _context2.sent;

                          _this3.handleDataSharing(data);
                          respDatabase[callName][callResTypeName][_this3.getKeyFromReq(data)] = {
                            data: [data]
                          };
                          _context2.next = 32;
                          return _this3.observeSubscriptions('data.tick', respDatabase, callDef);

                        case 32:
                          _context2.next = 36;
                          break;

                        case 34:
                          _context2.next = 36;
                          return _this3.observeSubscriptions('data.' + callName, respDatabase, callDef);

                        case 36:
                          _context2.next = 46;
                          break;

                        case 38:
                          _context2.next = 40;
                          return new Promise(function (r) {
                            return _observer.observer.register('data.' + callName, r, true);
                          });

                        case 40:
                          _data = _context2.sent;

                          _this3.handleDataSharing(_data);
                          key = _this3.getKeyFromReq(_data);
                          reqDef = respDatabase[callName][callResTypeName][key] = {
                            data: _data
                          };
                          _context2.next = 46;
                          return _this3.iterateNext(callDef, reqDef);

                        case 46:
                          _iteratorNormalCompletion3 = true;
                          _context2.next = 17;
                          break;

                        case 49:
                          _context2.next = 55;
                          break;

                        case 51:
                          _context2.prev = 51;
                          _context2.t0 = _context2['catch'](15);
                          _didIteratorError3 = true;
                          _iteratorError3 = _context2.t0;

                        case 55:
                          _context2.prev = 55;
                          _context2.prev = 56;

                          if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                          }

                        case 58:
                          _context2.prev = 58;

                          if (!_didIteratorError3) {
                            _context2.next = 61;
                            break;
                          }

                          throw _iteratorError3;

                        case 61:
                          return _context2.finish(58);

                        case 62:
                          return _context2.finish(55);

                        case 63:
                          _iteratorNormalCompletion2 = true;
                          _context2.next = 7;
                          break;

                        case 66:
                          _context2.next = 72;
                          break;

                        case 68:
                          _context2.prev = 68;
                          _context2.t1 = _context2['catch'](5);
                          _didIteratorError2 = true;
                          _iteratorError2 = _context2.t1;

                        case 72:
                          _context2.prev = 72;
                          _context2.prev = 73;

                          if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                          }

                        case 75:
                          _context2.prev = 75;

                          if (!_didIteratorError2) {
                            _context2.next = 78;
                            break;
                          }

                          throw _iteratorError2;

                        case 78:
                          return _context2.finish(75);

                        case 79:
                          return _context2.finish(72);

                        case 80:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _loop, _this3, [[5, 68, 72, 80], [15, 51, 55, 63], [56,, 58, 62], [73,, 75, 79]]);
                });
                _iterator = Object.keys(calls)[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 11;
                  break;
                }

                return _context3.delegateYield(_loop(), 't0', 8);

              case 8:
                _iteratorNormalCompletion = true;
                _context3.next = 6;
                break;

              case 11:
                _context3.next = 17;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t1 = _context3['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context3.t1;

              case 17:
                _context3.prev = 17;
                _context3.prev = 18;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 20:
                _context3.prev = 20;

                if (!_didIteratorError) {
                  _context3.next = 23;
                  break;
                }

                throw _iteratorError;

              case 23:
                return _context3.finish(20);

              case 24:
                return _context3.finish(17);

              case 25:
                return _context3.abrupt('return');

              case 26:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee2, this, [[3, 13, 17, 25], [18,, 20, 24]]);
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
        var _this4 = this;

        var reqDef;
        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return new Promise(function (r) {
                  _observer.observer.register(event, function (resp) {
                    var data = resp;
                    var key = _this4.getKeyFromReq(data);
                    var messageType = data.msg_type === 'tick' ? 'history' : data.msg_type;
                    var resps = respDatabase[messageType].subscriptions;
                    if (!(key in resps)) {
                      resps[key] = {
                        data: []
                      };
                    }
                    var rd = resps[key];
                    _this4.handleDataSharing(data);
                    var finished = _this4.handleSubscriptionLimits(data, rd.data, callDef);
                    if (finished) {
                      delete _this4.reqRespMap[data.req_id];
                      r(rd);
                    }
                  });
                });

              case 2:
                reqDef = _context4.sent;
                _context4.next = 5;
                return this.iterateNext(callDef, reqDef);

              case 5:
              case 'end':
                return _context4.stop();
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
        return regeneratorRuntime.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!callDef.next) {
                  _context5.next = 4;
                  break;
                }

                reqDef.next = {};
                _context5.next = 4;
                return this.iterateCalls(callDef.next, reqDef.next);

              case 4:
              case 'end':
                return _context5.stop();
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