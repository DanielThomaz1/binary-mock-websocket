'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    _classCallCheck(this, MockWsGenerator);

    this.calls = calls;
    this.sharedContext = {};
    this.api = new _binaryLiveApi.LiveApi({
      websocket: SpyWebSocket
    });
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
        var _this2 = this;

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
                            _context2.next = 70;
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
                            _context2.next = 53;
                            break;
                          }

                          callDefName = _step3.value;
                          callDef = callDefs[callDefName];

                          callDef.func(_this2.api, _this2.sharedContext);
                          logger = console;

                          logger.log(callDefName);

                          if (!(callResTypeName === 'subscriptions')) {
                            _context2.next = 41;
                            break;
                          }

                          if (!(callName === 'history')) {
                            _context2.next = 36;
                            break;
                          }

                          _this2.api.events.on(callResTypeName === 'errors' ? 'error' : 'history', function (ah) {
                            return _observer.observer.emit('data.history', ah);
                          });
                          _context2.next = 28;
                          return new Promise(function (r) {
                            return _observer.observer.register('data.history', r, true);
                          });

                        case 28:
                          data = _context2.sent;

                          _this2.handleDataSharing(data);
                          respDatabase[callName][callResTypeName][_this2.getKeyFromReq(data)] = {
                            data: [data]
                          };
                          _this2.api.events.on(callResTypeName === 'errors' ? 'error' : 'tick', function (at) {
                            return _observer.observer.emit('data.tick', at);
                          });
                          _context2.next = 34;
                          return _this2.observeSubscriptions('data.tick', respDatabase, callDef);

                        case 34:
                          _context2.next = 39;
                          break;

                        case 36:
                          _this2.api.events.on(callResTypeName === 'errors' ? 'error' : callName, function (an) {
                            return _observer.observer.emit('data.' + callName, an);
                          });
                          _context2.next = 39;
                          return _this2.observeSubscriptions('data.' + callName, respDatabase, callDef);

                        case 39:
                          _context2.next = 50;
                          break;

                        case 41:
                          _this2.api.events.on(callResTypeName === 'errors' ? 'error' : callName, function (ano) {
                            return _observer.observer.emit('data.' + callName, ano);
                          });
                          _context2.next = 44;
                          return new Promise(function (r) {
                            return _observer.observer.register('data.' + callName, r, true);
                          });

                        case 44:
                          _data = _context2.sent;

                          _this2.handleDataSharing(_data);
                          key = _this2.getKeyFromReq(_data);
                          reqDef = respDatabase[callName][callResTypeName][key] = {
                            data: _data
                          };
                          _context2.next = 50;
                          return _this2.iterateNext(callDef, reqDef);

                        case 50:
                          _iteratorNormalCompletion3 = true;
                          _context2.next = 17;
                          break;

                        case 53:
                          _context2.next = 59;
                          break;

                        case 55:
                          _context2.prev = 55;
                          _context2.t0 = _context2['catch'](15);
                          _didIteratorError3 = true;
                          _iteratorError3 = _context2.t0;

                        case 59:
                          _context2.prev = 59;
                          _context2.prev = 60;

                          if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                          }

                        case 62:
                          _context2.prev = 62;

                          if (!_didIteratorError3) {
                            _context2.next = 65;
                            break;
                          }

                          throw _iteratorError3;

                        case 65:
                          return _context2.finish(62);

                        case 66:
                          return _context2.finish(59);

                        case 67:
                          _iteratorNormalCompletion2 = true;
                          _context2.next = 7;
                          break;

                        case 70:
                          _context2.next = 76;
                          break;

                        case 72:
                          _context2.prev = 72;
                          _context2.t1 = _context2['catch'](5);
                          _didIteratorError2 = true;
                          _iteratorError2 = _context2.t1;

                        case 76:
                          _context2.prev = 76;
                          _context2.prev = 77;

                          if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                          }

                        case 79:
                          _context2.prev = 79;

                          if (!_didIteratorError2) {
                            _context2.next = 82;
                            break;
                          }

                          throw _iteratorError2;

                        case 82:
                          return _context2.finish(79);

                        case 83:
                          return _context2.finish(76);

                        case 84:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _loop, _this2, [[5, 72, 76, 84], [15, 55, 59, 67], [60,, 62, 66], [77,, 79, 83]]);
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
        var _this3 = this;

        var reqDef;
        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return new Promise(function (r) {
                  var listener = function listener(resp) {
                    var data = resp;
                    var key = _this3.getKeyFromReq(data);
                    var messageType = data.msg_type === 'tick' ? 'history' : data.msg_type;
                    var resps = respDatabase[messageType].subscriptions;
                    if (!(key in resps)) {
                      resps[key] = {
                        data: []
                      };
                    }
                    var rd = resps[key];
                    _this3.handleDataSharing(data);
                    var finished = _this3.handleSubscriptionLimits(data, rd.data, callDef);
                    if (finished) {
                      _observer.observer.unregister(event, listener);
                      r(rd);
                    }
                  };
                  _observer.observer.register(event, listener);
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
      } else if (data.msg_type === 'buy' && !data.error) {
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
      return JSON.stringify(data.echo_req);
    }
  }]);

  return MockWsGenerator;
}();

exports.default = MockWsGenerator;