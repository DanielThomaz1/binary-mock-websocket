'use strict';

require('babel-polyfill');

var _mockWsGenerator = require('./mockWsGenerator');

var _mockWsGenerator2 = _interopRequireDefault(_mockWsGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var File = require('vinyl');
var through = require('through2');
var fs = require('fs');


module.exports = function () {
	return through.obj(function (callFile, encoding, callback) {
		var mock = new _mockWsGenerator2.default(require(callFile.path));
		var throughObj = this;
		mock.generate().then(function (output) {
			throughObj.push(new File({
				cwd: __dirname,
				base: __dirname,
				path: __dirname + '/database.js',
				contents: new Buffer(output)
			}));
			var data = fs.readFileSync(__dirname + '/websocket.js');
			throughObj.push(new File({
				cwd: __dirname,
				base: __dirname,
				path: __dirname + '/websocket.js',
				contents: new Buffer(data)
			}));
			callback();
		});
	});
};