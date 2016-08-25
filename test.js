import CustomApi from 'binary-common-utils/lib/customApi';
import WebSocket from './dist/websocket';
import { observer } from 'binary-common-utils/lib/observer';
import { expect } from 'chai';

describe('Try to authorize with invalid token', () => {
  let api;
  let response;
  before(function (done) {
    api = new CustomApi(WebSocket);
    observer.register('api.error').then((_response) => {
      response = _response.data;
      done();
    });
    api.authorize('FakeToken');
  });
  it('Authorize should fail', () => {
    expect(response).to.have.deep.property('.code')
      .that.is.equal('InvalidToken');
  });
});
