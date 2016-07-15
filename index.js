var File = require('vinyl');
var through = require('through2');
var fs = require('fs');
var asyncChain = require('binary-common-utils/tools').asyncChain;
var Mock = require('./mock');

module.exports = function() {
	return through.obj(function(callFile, encoding, callback) {
		var mock = new Mock(callFile.path);
		var throughObj = this;
		asyncChain()
			.pipe(function(done){
				mock.generate().then(function(output){
					throughObj.push(new File({
						cwd: __dirname,
						base: __dirname,
						path: __dirname + '/database.js',
						contents: new Buffer(output)
					}));
					done();
				});
			})
			.pipe(function(done){
				var data = fs.readFileSync(__dirname + '/websocket.js');
				throughObj.push(new File({
					cwd: __dirname,
					base: __dirname,
					path: __dirname + '/websocket.js',
					contents: new Buffer(data)
				}));
				done();
			})
			.pipe(function(){
				callback();
			})
			.exec();
	});
};

