import { LiveApi } from 'binary-live-api';
import { observer } from 'binary-common-utils/lib/observer';
import WebSocket from 'ws';

export default class MockWsGenerator {
  constructor(calls) {
    this.calls = calls;
    this.sharedContext = {};
    this.respDatabase = {};
    this.reqIdToReq = {};
    this.api = new LiveApi({
      websocket: WebSocket,
      sendSpy: (rawData) => {
        const data = JSON.parse(rawData);
        this.reqIdToReq[data.req_id] = rawData;
      },
    });
  }
  async generate() {
    await this.iterateCalls(this.calls, this.respDatabase);
    return 'module.exports = ' + JSON.stringify(this.respDatabase).replace("'", "\\'") + ';';
  }
  async iterateCalls(calls, respDatabase) {
    for (const callName of Object.keys(calls)) {
      const callResTypes = calls[callName];
      for (const callResTypeName of Object.keys(callResTypes)) {
        const callDefs = callResTypes[callResTypeName];
        respDatabase[callName] = (!(callName in respDatabase)) ? {}
          : respDatabase[callName];
        respDatabase[callName][callResTypeName] = (!(callResTypeName in respDatabase[callName])) ? {}
          : respDatabase[callName][callResTypeName];
        for (const callDefName of Object.keys(callDefs)) {
          const callDef = callDefs[callDefName];
          callDef.func(this.api, this.sharedContext);
          const logger = console;
          logger.log(callDefName);
          if (callResTypeName === 'subscriptions') {
            if (['history', 'candles'].indexOf(callName) >= 0) {
              const second = (callName === 'history') ? 'tick' : 'ohlc';
              this.api.events.on((callResTypeName === 'errors') ? 'error' : callName,
                (ah) => observer.emit('data.' + callName, ah));
              const data = await new Promise((r) => observer.register('data.' + callName, r, true));
              this.handleDataSharing(data);
              respDatabase[callName][callResTypeName][this.getKeyFromReq(data)] = {
                data: [data],
              };
              this.api.events.on((callResTypeName === 'errors') ? 'error' : second,
                (at) => observer.emit('data.' + second, at));
              await this.observeSubscriptions('data.' + second, respDatabase, callDef);
            } else {
              this.api.events.on((callResTypeName === 'errors') ? 'error' : callName,
                (an) => observer.emit('data.' + callName, an));
              await this.observeSubscriptions('data.' + callName, respDatabase, callDef);
            }
          } else {
            this.api.events.on((callResTypeName === 'errors') ? 'error' : callName,
              (ano) => observer.emit('data.' + callName, ano));
            const data = await new Promise((r) => observer.register('data.' + callName, r, true));
            this.handleDataSharing(data);
            const key = this.getKeyFromReq(data);
            const reqDef = respDatabase[callName][callResTypeName][key] = {
              data,
            };
            await this.iterateNext(callDef, reqDef);
          }
        }
      }
    }
    return;
  }
  async observeSubscriptions(event, respDatabase, callDef) {
    const reqDef = await new Promise((r) => {
      const listener = (resp) => {
        const data = resp;
        const key = this.getKeyFromReq(data);
        let messageType;
        if (data.msg_type === 'tick') {
          messageType = 'history';
        } else if (data.msg_type === 'ohlc') {
          messageType = 'candles';
        } else {
          messageType = data.msg_type;
        }
        const resps = respDatabase[messageType].subscriptions;
        if (!(key in resps)) {
          resps[key] = {
            data: [],
          };
        }
        const rd = resps[key];
        this.handleDataSharing(data);
        const finished = this.handleSubscriptionLimits(data, rd.data, callDef);
        if (finished) {
          observer.unregister(event, listener);
          r(rd);
        }
      };
      observer.register(event, listener);
    });
    await this.iterateNext(callDef, reqDef);
  }
  async iterateNext(callDef, reqDef) {
    if (callDef.next) {
      reqDef.next = {};
      await this.iterateCalls(callDef.next, reqDef.next);
    }
  }
  handleSubscriptionLimits(data, defData, callDef) {
    defData.push(data);
    if (defData.length === callDef.maxResponse || (callDef.stopCondition && callDef.stopCondition(data))) {
      return true;
    }
    return false;
  }
  handleDataSharing(data) {
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
  replaceSensitiveData(data) {
    if (data.msg_type === 'authorize' && !data.error) {
      data.authorize.loginid = 'VRTC1234567';
      data.authorize.email = 'root@localhost.localdomain';
    }
  }
  getKeyFromReq(data) {
    return this.reqIdToReq[data.req_id];
  }
}
