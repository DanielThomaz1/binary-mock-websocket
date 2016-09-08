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

var MockWsGenerator = function () {
  function MockWsGenerator(calls) {
    var _this = this;

    _classCallCheck(this, MockWsGenerator);

    this.calls = calls;
    this.sharedContext = {};
    this.respDatabase = {};
    this.reqIdToReq = {};
    this.api = new _binaryLiveApi.LiveApi({
      websocket: _ws2.default,
      sendSpy: function sendSpy(rawData) {
        var data = JSON.parse(rawData);
        _this.reqIdToReq[data.req_id] = rawData;
      }
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
                return this.iterateCalls(this.calls, this.respDatabase);

              case 2:
                return _context.abrupt('return', 'module.exports = ' + JSON.stringify(this.respDatabase).replace("'", "\\'") + ';');

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
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(calls, respDatabase) {
        var _this2 = this;

        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return regeneratorRuntime.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 3;
                _loop = regeneratorRuntime.mark(function _loop() {
                  var callName, callResTypes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, callResTypeName, callDefs, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, callDefName, callDef, logger, _data, key, reqDef;

                  return regeneratorRuntime.wrap(function _loop$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          callName = _step.value;
                          callResTypes = calls[callName];
                          _iteratorNormalCompletion2 = true;
                          _didIteratorError2 = false;
                          _iteratorError2 = undefined;
                          _context3.prev = 5;
                          _iterator2 = Object.keys(callResTypes)[Symbol.iterator]();

                        case 7:
                          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context3.next = 62;
                            break;
                          }

                          callResTypeName = _step2.value;
                          callDefs = callResTypes[callResTypeName];

                          respDatabase[callName] = !(callName in respDatabase) ? {} : respDatabase[callName];
                          respDatabase[callName][callResTypeName] = !(callResTypeName in respDatabase[callName]) ? {} : respDatabase[callName][callResTypeName];
                          _iteratorNormalCompletion3 = true;
                          _didIteratorError3 = false;
                          _iteratorError3 = undefined;
                          _context3.prev = 15;
                          _iterator3 = Object.keys(callDefs)[Symbol.iterator]();

                        case 17:
                          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context3.next = 45;
                            break;
                          }

                          callDefName = _step3.value;
                          callDef = callDefs[callDefName];

                          callDef.func(_this2.api, _this2.sharedContext);
                          logger = console;

                          logger.log(callDefName);

                          if (!(callResTypeName === 'subscriptions')) {
                            _context3.next = 33;
                            break;
                          }

                          if (!(['history', 'candles'].indexOf(callName) >= 0)) {
                            _context3.next = 28;
                            break;
                          }

                          return _context3.delegateYield(regeneratorRuntime.mark(function _callee2() {
                            var second, data;
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    second = callName === 'history' ? 'tick' : 'ohlc';

                                    _this2.api.events.on(callResTypeName === 'errors' ? 'error' : callName, function (ah) {
                                      return _observer.observer.emit('data.' + callName, ah);
                                    });
                                    _context2.next = 4;
                                    return new Promise(function (r) {
                                      return _observer.observer.register('data.' + callName, r, true);
                                    });

                                  case 4:
                                    data = _context2.sent;

                                    _this2.handleDataSharing(data);
                                    respDatabase[callName][callResTypeName][_this2.getKeyFromReq(data)] = {
                                      data: [data]
                                    };
                                    _this2.api.events.on(callResTypeName === 'errors' ? 'error' : second, function (at) {
                                      return _observer.observer.emit('data.' + second, at);
                                    });
                                    _context2.next = 10;
                                    return _this2.observeSubscriptions('data.' + second, respDatabase, callDef);

                                  case 10:
                                  case 'end':
                                    return _context2.stop();
                                }
                              }
                            }, _callee2, _this2);
                          })(), 't0', 26);

                        case 26:
                          _context3.next = 31;
                          break;

                        case 28:
                          _this2.api.events.on(callResTypeName === 'errors' ? 'error' : callName, function (an) {
                            return _observer.observer.emit('data.' + callName, an);
                          });
                          _context3.next = 31;
                          return _this2.observeSubscriptions('data.' + callName, respDatabase, callDef);

                        case 31:
                          _context3.next = 42;
                          break;

                        case 33:
                          _this2.api.events.on(callResTypeName === 'errors' ? 'error' : callName, function (ano) {
                            return _observer.observer.emit('data.' + callName, ano);
                          });
                          _context3.next = 36;
                          return new Promise(function (r) {
                            return _observer.observer.register('data.' + callName, r, true);
                          });

                        case 36:
                          _data = _context3.sent;

                          _this2.handleDataSharing(_data);
                          key = _this2.getKeyFromReq(_data);
                          reqDef = respDatabase[callName][callResTypeName][key] = {
                            data: _data
                          };
                          _context3.next = 42;
                          return _this2.iterateNext(callDef, reqDef);

                        case 42:
                          _iteratorNormalCompletion3 = true;
                          _context3.next = 17;
                          break;

                        case 45:
                          _context3.next = 51;
                          break;

                        case 47:
                          _context3.prev = 47;
                          _context3.t1 = _context3['catch'](15);
                          _didIteratorError3 = true;
                          _iteratorError3 = _context3.t1;

                        case 51:
                          _context3.prev = 51;
                          _context3.prev = 52;

                          if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                          }

                        case 54:
                          _context3.prev = 54;

                          if (!_didIteratorError3) {
                            _context3.next = 57;
                            break;
                          }

                          throw _iteratorError3;

                        case 57:
                          return _context3.finish(54);

                        case 58:
                          return _context3.finish(51);

                        case 59:
                          _iteratorNormalCompletion2 = true;
                          _context3.next = 7;
                          break;

                        case 62:
                          _context3.next = 68;
                          break;

                        case 64:
                          _context3.prev = 64;
                          _context3.t2 = _context3['catch'](5);
                          _didIteratorError2 = true;
                          _iteratorError2 = _context3.t2;

                        case 68:
                          _context3.prev = 68;
                          _context3.prev = 69;

                          if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                          }

                        case 71:
                          _context3.prev = 71;

                          if (!_didIteratorError2) {
                            _context3.next = 74;
                            break;
                          }

                          throw _iteratorError2;

                        case 74:
                          return _context3.finish(71);

                        case 75:
                          return _context3.finish(68);

                        case 76:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _loop, _this2, [[5, 64, 68, 76], [15, 47, 51, 59], [52,, 54, 58], [69,, 71, 75]]);
                });
                _iterator = Object.keys(calls)[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context4.next = 11;
                  break;
                }

                return _context4.delegateYield(_loop(), 't0', 8);

              case 8:
                _iteratorNormalCompletion = true;
                _context4.next = 6;
                break;

              case 11:
                _context4.next = 17;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t1 = _context4['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context4.t1;

              case 17:
                _context4.prev = 17;
                _context4.prev = 18;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 20:
                _context4.prev = 20;

                if (!_didIteratorError) {
                  _context4.next = 23;
                  break;
                }

                throw _iteratorError;

              case 23:
                return _context4.finish(20);

              case 24:
                return _context4.finish(17);

              case 25:
                return _context4.abrupt('return');

              case 26:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee3, this, [[3, 13, 17, 25], [18,, 20, 24]]);
      }));

      function iterateCalls(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return iterateCalls;
    }()
  }, {
    key: 'observeSubscriptions',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(event, respDatabase, callDef) {
        var _this3 = this;

        var reqDef;
        return regeneratorRuntime.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return new Promise(function (r) {
                  var listener = function listener(resp) {
                    var data = resp;
                    var key = _this3.getKeyFromReq(data);
                    var messageType = void 0;
                    if (data.msg_type === 'tick') {
                      messageType = 'history';
                    } else if (data.msg_type === 'ohlc') {
                      messageType = 'candles';
                    } else {
                      messageType = data.msg_type;
                    }
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
                reqDef = _context5.sent;
                _context5.next = 5;
                return this.iterateNext(callDef, reqDef);

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));

      function observeSubscriptions(_x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return observeSubscriptions;
    }()
  }, {
    key: 'iterateNext',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(callDef, reqDef) {
        return regeneratorRuntime.wrap(function _callee5$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!callDef.next) {
                  _context6.next = 4;
                  break;
                }

                reqDef.next = {};
                _context6.next = 4;
                return this.iterateCalls(callDef.next, reqDef.next);

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee5, this);
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
      return this.reqIdToReq[data.req_id];
    }
  }]);

  return MockWsGenerator;
}();

exports.default = MockWsGenerator;