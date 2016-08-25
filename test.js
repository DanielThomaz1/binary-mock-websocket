'use strict';
var CustomApi = require('binary-common-utils/lib/customApi');
import {observer} from 'binary-common-utils/lib/observer';
var expect = require('chai').expect;
var Mock = require('./dist/websocket');

describe('Try to authorize with invalid token', function(){
	var api;
	var response;
	before(function(done){
		api = new CustomApi(Mock);
		console.log(observer.register);
		observer.register('api.error', true).then((_response) => {
			response = _response;
			done();
		});
		api.authorize('FakeToken');
	});
	it('Authorize should fail', function(){
		expect(response).to.have.deep.property('.code')
			.that.is.equal('InvalidToken');
	});
});
