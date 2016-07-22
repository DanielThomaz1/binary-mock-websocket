var LiveApi = require('binary-live-api').LiveApi;
var Observer = require('binary-common-utils/observer');
var tools = require('binary-common-utils/tools');
var _ = require('underscore');

var observer = new Observer();
var Mock = function Mock(callFile){
	this.calls = require(callFile);
	this.global = {};
	this.requestList = {};
	this.api = new LiveApi({websocket: require('ws')});
	this.responseDatabase = this.deepCloneDatabase(this.calls);
	var originalOnMessage = this.api.socket._events.message;
	var that = this;
	this.api.send = function send(json){
		var reqId = Math.floor(Math.random() * 1e15);
		that.requestList[reqId] = json;
		return that.api.sendRaw.call(that.api, _.extend({
			req_id: reqId
		}, json));
	};
	this.api.socket._events.message = function onMessage(rawData, flags){
		var data = JSON.parse(rawData);
		that.replaceSensitiveData(data);
		observer.emit('data.'+data.msg_type, data);
		originalOnMessage(rawData, flags);
	};
};

Mock.prototype = Object.create(null, {
	generate: {
		value: function generate() {
			var that = this;
			return new Promise(function(resolve, reject){
				that.iterateCalls(that.calls, that.responseDatabase, function(){
					resolve("module.exports = " + JSON.stringify(that.responseDatabase).replace("'", "\\'") + ';'); 
				});
			});
		}
	},
	replaceSensitiveData:{
		value: function replaceSensitiveData(data){
			switch(data.msg_type) {
				case 'authorize':
					if (!data.error) {
						data.authorize.loginid = 'VRTC1234567';
						data.authorize.email = 'root@localhost.localdomain';
					}
					break;
				default:
					break;
			}
		}
	},
	handleSubscriptionLimits: {
		value: function handleSubscriptionLimits(data, responseData, option) {
			responseData.push(data);
			if ( responseData.length === option.maxResponse || ( option.stopCondition && option.stopCondition(data) ) ) {
				return true;
			}
			return false;
		}
	},
	handleDataSharing: {
		value: function handleDataSharing(data) {
			switch(data.msg_type) {
				case 'proposal':
					this.global.contract = data.proposal;
					break;
				case 'buy':
					if ( !data.error ) {
						if ( data.buy.shortcode.indexOf('DIGITEVEN') >= 0 ) {
							this.global.evenPurchasedContract = data.buy.contract_id;
						} else {
							this.global.oddPurchasedContract = data.buy.contract_id;
						}
					}
					break;
				default:
					break;
			}
		} 
	},
	getKeyFromRequest: {
		value: function getKeyFromRequest(data) {
			return JSON.stringify(this.requestList[data.req_id]);
		}
	},
	observeSubscriptions: {
		value: function observeSubscriptions(data, responseDatabase, option, callback){
			var key = this.getKeyFromRequest(data);
			var messageType = (data.msg_type === 'tick') ? 'history': data.msg_type;
			var responses = responseDatabase[messageType].subscriptions;
			if (!responses.hasOwnProperty(key)){
				responses[key] = {
					data: []
				};
			}
			var responseData = responses[key];
			this.handleDataSharing(data);
			var finished = this.handleSubscriptionLimits(
				data,
				responseData.data,
				option
			);
			if ( finished ) {
				observer.unregisterAll('data.' + data.msg_type);
				callback = this.wrapCallback(option, responseData, callback);
				callback();
			}
		}
	},
	wrapCallback: {
		value: function wrapCallback(option, responseData, callback) {
			var that = this;
			if ( !_.isEmpty(option.next) ) {
				var old_callback = callback;
				callback = function callback(){
					if ( !responseData.hasOwnProperty('next') ) {
						responseData.next = {};
					}
					that.iterateCalls(option.next, responseData.next, function(){
						old_callback();
					});
				};
			}
			return callback;
		}
	},
	iterateCalls: {
		value: function iterateCalls(calls, responseDatabase, iterateCallback) {
			var that = this;
			tools.asyncForEach(Object.keys(calls), function(callName, index, callback){
				var responseTypes = calls[callName];
				tools.asyncForEach(Object.keys(responseTypes), function(responseTypeName, index, callback){
					var options = responseTypes[responseTypeName];
					if ( !responseDatabase.hasOwnProperty(callName) ){
						responseDatabase[callName] = {};
					}
					if ( !responseDatabase[callName].hasOwnProperty(responseTypeName) ) {
						responseDatabase[callName][responseTypeName] = {};
					}
					tools.asyncForEach(Object.keys(options), function(optionName, index, callback){
						var option = options[optionName];
						option.func(that.api, that.global);
						console.log(optionName);
						if (responseTypeName === 'subscriptions') {
							if ( callName === 'history' ) {
								observer.registerOnce('data.history', function(data){
									that.handleDataSharing(data);
									responseDatabase[callName][responseTypeName][that.getKeyFromRequest(data)] = {
										data: [data]
									};
								});
								observer.register('data.tick', function(data){
									that.observeSubscriptions(data, responseDatabase, option, callback);
								});
							} else {
								observer.register('data.' + callName, function(data){
									that.observeSubscriptions(data, responseDatabase, option, callback);
								});
							}
						} else {
							observer.registerOnce('data.' + callName, function(data){
								that.handleDataSharing(data);
								var key = that.getKeyFromRequest(data);
								var responseData = responseDatabase[callName][responseTypeName][key] = {
									data: data
								};
								callback = that.wrapCallback(option, responseData, 
									callback);
								callback();
							});
						}
					}, function(){
						callback();
					});
				}, function(){
					callback();
				});
			}, function(){
				iterateCallback();
			});
		}
	},
	deepCloneDatabase: {
		value: function deepCloneDatabase(database) {
			var result = {};
			for ( var callName in database ) {
				for ( var responseTypeName in database[callName] ) {
					if ( !result.hasOwnProperty(callName) ) {
						result[callName] = {};
					}
					result[callName][responseTypeName] = {};
				}
			}
			return result;
		}
	}
});

module.exports = Mock;
