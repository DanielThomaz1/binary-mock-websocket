import dumpedDb from './database';

export default class WebSocket {
  constructor(url) {
    this.delay = 10;
    this.url = url;
    this.bufferedResponse = [];
    this.queuedRequest = [];
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
    this.handleForget(reqData, onmessage);
    let database = this.getResponseFromBuffer(reqData);
    database = (!this.isEmpty(database)) ? database : dumpedDb;
    this.parseDb(database, reqData, onmessage);
  }
  async parseDb(database, reqData, onmessage) {
    let messageSuccess = false;
    for (let callName of Object.keys(database)) {
      if (callName in reqData || (callName === 'history' && 'ticks_history' in reqData)) {
        let callResTypes = database[callName];
        for (let callResTypeName of Object.keys(callResTypes)) {
          let respData = this.findKeyInObj(callResTypes[callResTypeName], reqData);
          if (respData) {
            messageSuccess = await this.passMessageOn(reqData, respData, onmessage);
          }
        }
      }
    }
    if (!messageSuccess) {
      this.queuedRequest.push({
				data: reqData,
        onmessage,
      });
    }
  }
  async passMessageOn(reqData, respData, onmessage) {
    if (reqData.subscribe) {
      for (let rd of respData.data) {
        await this.delayedOnMessage(reqData, rd, onmessage, respData.next);
      }
    } else {
      await this.delayedOnMessage(reqData, respData.data, onmessage, respData.next);
    }
  }
  delayedOnMessage(reqData, respData, onmessage, next) {
    return new Promise((r) => {
      setTimeout(() => {
        if (this.readyState === 0) {
          return;
        }
        if (!this.isEmpty(next)) {
          this.addToResponseBuffer(next);
        }
        respData.echo_req.req_id = respData.req_id = reqData.req_id;
        onmessage(JSON.stringify(respData));
        r();
      }, this.delay);
    });
  }
  handleForget(reqData, onmessage) {
    if ('forget_all' in reqData || ('subscribe' in reqData && reqData.subscribe === 0)) {
      setTimeout(() => {
        if (this.readyState === 0) {
          return;
        }
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
      return;
    }
  }
  addToResponseBuffer(database) {
    this.bufferedResponse.push(database);
    if (!this.isEmpty(this.queuedRequest)) {
      for (let req of this.queuedRequest) {
        this.getResponse(req.data, req.onmessage);
      }
      this.queuedRequest = [];
    }
  }
  getResponseFromBuffer(reqData) {
    let index = this.bufferedResponse.findIndex((_data) => !this.isEmpty(this.findDataInBuffer(reqData, _data)));
    return (index < 0) ? null : this.bufferedResponse[index];
  }
  findDataInBuffer(reqData, database) {
    for (let callName of Object.keys(database)) {
      if ((callName === 'history' && 'ticks_history' in reqData) || callName in reqData) {
        let callResTypes = database[callName];
        for (let callResTypeName of Object.keys(callResTypes)) {
          let respData = this.findKeyInObj(callResTypes[callResTypeName], reqData);
          if (respData) {
            return database;
          }
        }
      }
    }
    return null;
  }
  removeReqId(_data) {
    let data = {
      ..._data,
    };
    delete data.req_id;
    if (data.echo_req) {
      delete data.echo_req.req_id;
    }
    return data;
  }
  findKeyInObj(obj1, obj2) {
    for (let key of Object.keys(obj1)) {
      if (JSON.stringify(this.removeReqId(JSON.parse(key))) === JSON.stringify(this.removeReqId(obj2))) {
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
    let reqData = JSON.parse(rawData);
    this.getResponse(reqData, (receivedData) => {
      this.onmessage({
        data: receivedData,
      });
    });
  }
  close() {
    this.readyState = 0;
  }
}
