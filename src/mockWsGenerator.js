import { LiveApi } from 'binary-live-api';
import { observer } from 'binary-common-utils/lib/observer';
import WebSocket from 'ws';

class SpyWebSocket extends WebSocket {
  constructor(...args) {
    super(...args);
    this.respDatabase = {};
  }
}

export default class MockWsGenerator {
  constructor(calls) {
    this.calls = calls;
    this.sharedContext = {};
    this.reqRespMap = {};
    this.api = new LiveApi({
      websocket: SpyWebSocket,
    });
    this.api.send = (json) => {
      const reqId = Math.floor((Math.random() * 1e15));
      return this.api.sendRaw(this.reqRespMap[reqId] = {
				req_id: reqId,
        ...json,
      });
    };
    let originalOnMessage = this.api.socket._events.message; // eslint-disable-line no-underscore-dangle
    this.api.socket._events.message = (rawData, flags) => { // eslint-disable-line no-underscore-dangle
      let data = JSON.parse(rawData);
      if (!(data.req_id in this.reqRespMap)) {
        originalOnMessage(rawData, flags);
        return;
      }
      data.echo_req = this.reqRespMap[data.req_id];
      this.replaceSensitiveData(data);
      observer.emit('data.' + data.msg_type, data);
      originalOnMessage(rawData, flags);
    };
  }
  async generate() {
    await this.iterateCalls(this.calls, this.api.socket.respDatabase);
    return 'module.exports = ' + JSON.stringify(this.api.socket.respDatabase).replace("'", "\\'") + ';';
  }
  async iterateCalls(calls, respDatabase) {
    for (let callName of Object.keys(this.calls)) {
      let callResTypes = calls[callName];
      for (let callResTypeName of Object.keys(callResTypes)) {
        let callDefs = callResTypes[callResTypeName];
        respDatabase[callName] = (!(callName in respDatabase)) ? {}
          : respDatabase[callName];
        respDatabase[callName][callResTypeName] = (!(callResTypeName in respDatabase[callName])) ? {}
          : respDatabase[callName][callResTypeName];
        for (let callDefName of Object.keys(callDefs)) {
          let callDef = callDefs[callDefName];
          callDef.func(this.api, this.sharedContext);
          console.log(callDefName);
          if (callResTypeName === 'subscriptions') {
            if (callName === 'history') {
              let data = (await observer.register('data.history')).data;
              this.handleDataSharing(data);
              respDatabase[callName][callResTypeName][this.getKeyFromReq(data)] = {
                data: [data],
              };
              await this.observeSubscriptions('data.tick', respDatabase, callDef);
            } else {
              await this.observeSubscriptions('data.' + callName, respDatabase, callDef);
            }
          } else {
            let data = (await observer.register('data.' + callName)).data;
            this.handleDataSharing(data);
            let key = this.getKeyFromReq(data);
            respDatabase[callName][callResTypeName][key] = {
              data,
            };
          }
        }
      }
    }
		return;
  }
  async observeSubscriptions(event, respDatabase, option) {
    let promise = await observer.register(event);
    let forever = true;
    while (forever) {
      let resp = await promise;
      let data = resp.data;
      let key = this.getKeyFromReq(data);
      let messageType = (data.msg_type === 'tick') ? 'history' : data.msg_type;
      let resps = respDatabase[messageType].subscriptions;
      if (!(key in resps)) {
        resps[key] = {
          data: [],
        };
      }
      let reqDef = resps[key];
      this.handleDataSharing(data);
      let finished = this.handleSubscriptionLimits(data, reqDef.data, option);
      if (finished) {
        delete this.reqRespMap[data.req_id];
        break;
      } else {
        promise = resp.next;
      }
    }
  }
  handleSubscriptionLimits(data, defData, option) {
    defData.push(data);
    if (defData.length === option.maxResponse || (option.stopCondition && option.stopCondition(data))) {
      return true;
    }
    return false;
  }
  handleDataSharing(data) {
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
  replaceSensitiveData(data) {
    if (data.msg_type === 'authorize' && !data.error) {
      data.authorize.loginid = 'VRTC1234567';
      data.authorize.email = 'root@localhost.localdomain';
    }
  }
  getKeyFromReq(data) {
    return JSON.stringify(this.reqRespMap[data.req_id]);
  }
}
