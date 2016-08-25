import 'babel-polyfill';
var File = require('vinyl');
var through = require('through2');
var fs = require('fs');
import MockWsGenerator from './mockWsGenerator';

module.exports = function() {
	return through.obj(function(callFile, encoding, callback) {
		var mock = new MockWsGenerator(require(callFile.path));
		var throughObj = this;
		mock.generate().then(function(output){
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

