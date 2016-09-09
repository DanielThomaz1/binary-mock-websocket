'use strict';

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _mockWsGenerator = require('./mockWsGenerator');

var _mockWsGenerator2 = _interopRequireDefault(_mockWsGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _through2.default.obj(function throughFunc(callFile, encoding, callback) {
  var _this = this;

  var mock = new _mockWsGenerator2.default(require(callFile.path)); // eslint-disable-line
  mock.generate().then(function (output) {
    _this.push(new _vinyl2.default({
      cwd: __dirname,
      base: __dirname,
      path: _path2.default.join(__dirname, 'database.js'),
      contents: new Buffer(output)
    }));
    var data = _fs2.default.readFileSync(_path2.default.join(__dirname, 'websocket.js'));
    _this.push(new _vinyl2.default({
      cwd: __dirname,
      base: __dirname,
      path: _path2.default.join(__dirname, 'websocket.js'),
      contents: new Buffer(data)
    }));
    callback();
  });
});