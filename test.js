'use strict';
var CustomApi = require('binary-common-utils/customApi');
var Observer = require('binary-common-utils/observer');
var expect = require('chai').expect;
var Mock = require('./dist/websocket');

var observer = new Observer();
describe('Try to authorize with invalid token', function(){
	var api;
	var response;
	before(function(done){
		api = new CustomApi(Mock);
		observer.register('api.error', function(_response){
			response = _response;
			done();
		}, true);
		api.authorize('FakeToken');
	});
	it('Authorize should fail', function(){
		expect(response).to.have.property('code')
			.that.is.equal('InvalidToken');
	});
});
