import 'babel-polyfill';
import _ from 'underscore';
import dumpedDb from './database'; // eslint-disable-line import/no-unresolved

export default class WebSocket {
  constructor(url) {
    this.delay = 10;
    this.url = url;
    this.bufferedResponses = [];
    // providing ws interface
    this.readyState = 0;
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    // open automatically on creation
    setTimeout(() => {
      this.readyState = 1;
      this.onopen();
    }, this.delay * 10);
  }
  getResponse(reqData, onmessage) {
    if ('forget_all' in reqData || ('subscribe' in reqData && reqData.subscribe === 0)) {
      this.handleForget(reqData, onmessage);
    } else {
      let database = this.findDataInBuffer(reqData);
      database = (!this.isEmpty(database)) ? database : dumpedDb;
      this.parseDb(database, reqData, onmessage);
    }
  }
  async parseDb(database, reqData, onmessage) {
    for (const callName of Object.keys(database)) {
      if (callName in reqData || ((callName === 'candles' || callName === 'history') && 'ticks_history' in reqData)) {
        const callResTypes = database[callName];
        for (const callResTypeName of Object.keys(callResTypes)) {
          const respData = this.findKeyInObj(callResTypes[callResTypeName], reqData);
          if (respData) {
            await this.passMessageOn(reqData, respData, onmessage);
          }
        }
      }
    }
  }
  async passMessageOn(reqData, respData, onmessage) {
    if (!this.isEmpty(respData.next)) {
      this.bufferedResponses.push(respData.next);
    }
    if (reqData.subscribe) {
      if ('ticks_history' in reqData) {
        await this.delayedOnMessage(reqData, respData.data[0], onmessage);
        const first = respData.data[1];
        for (let i = 0; i < 60; i++) {
          const newTick = {
            ...first,
          };
          if ('ohlc' in first) {
            newTick.ohlc.close = `${+first.ohlc.close + (i * 0.1)}`;
            newTick.ohlc.epoch = `${+first.ohlc.epoch + (i * 2)}`;
          } else {
            newTick.tick.epoch = `${+first.tick.epoch + (i * 2)}`;
            newTick.tick.quote = `${+first.tick.quote + (i * 0.1)}`;
          }
          await this.delayedOnMessage(reqData, newTick, onmessage);
        }
      } else {
        for (const rd of respData.data) {
          await this.delayedOnMessage(reqData, rd, onmessage);
        }
      }
    } else {
      await this.delayedOnMessage(reqData, respData.data, onmessage);
    }
  }
  delayedOnMessage(reqData, respData, onmessage) {
    return new Promise((r) => {
      setTimeout(() => {
        respData.echo_req.req_id = respData.req_id = reqData.req_id;
        onmessage(JSON.stringify(respData));
        r();
      }, this.delay);
    });
  }
  handleForget(reqData, onmessage) {
    setTimeout(() => {
      onmessage(JSON.stringify({
        echo_req: {
          req_id: reqData.req_id,
          forget_all: 'ticks',
        },
        req_id: reqData.req_id,
        forget_all: [],
        msg_type: 'forget_all',
      }));
    }, this.delay);
  }
  findDataInBuffer(reqData) {
    let result = null;
    for (const database of this.bufferedResponses) {
      for (const callName of Object.keys(database)) {
        if (((callName === 'candles' || callName === 'history') && 'ticks_history' in reqData) || callName in reqData) {
          const callResTypes = database[callName];
          for (const callResTypeName of Object.keys(callResTypes)) {
            const respData = this.findKeyInObj(callResTypes[callResTypeName], reqData);
            if (respData) {
              result = database;
            }
          }
        }
      }
    }
    return result;
  }
  removeReqId(_data) {
    const data = {
      ..._data,
    };
    delete data.req_id;
    if (data.echo_req) {
      delete data.echo_req.req_id;
    }
    return data;
  }
  findKeyInObj(obj1, obj2) {
    for (const key of Object.keys(obj1)) {
      if (_.isEqual(this.removeReqId(JSON.parse(key)), this.removeReqId(obj2))) {
        return obj1[key];
      }
    }
    return null;
  }
  isEmpty(obj) {
    return !obj || (obj instanceof Array && !obj.length) || !Object.keys(obj).length;
  }
  send(rawData) {
    if (this.readyState === 0) {
      return;
    }
    const reqData = JSON.parse(rawData);
    this.getResponse(reqData, (receivedData) => {
      if (this.readyState) {
        this.onmessage({
          data: receivedData,
        });
      }
    });
  }
  close() {
    this.readyState = 0;
    this.bufferedResponses = [];
    this.onopen = null;
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
  }
}
