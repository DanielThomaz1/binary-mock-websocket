import 'babel-polyfill';
import fs from 'fs';
import File from 'vinyl';
import path from 'path';
import through from 'through2';
import MockWsGenerator from './mockWsGenerator';

module.exports = through.obj(function throughFunc(callFile, encoding, callback) {
  const mock = new MockWsGenerator(require(callFile.path)); // eslint-disable-line
  mock.generate().then((output) => {
    this.push(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'database.js'),
      contents: new Buffer(output),
    }));
    const data = fs.readFileSync(path.join(__dirname, 'websocket.js'));
    this.push(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'websocket.js'),
      contents: new Buffer(data),
    }));
    callback();
  });
});
