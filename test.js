import CustomApi from 'binary-common-utils/lib/customApi';
import { observer } from 'binary-common-utils/lib/observer';
import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import WebSocket from './dist/websocket';

describe('Try to authorize with invalid token', () => {
  let api;
  let response;
  before(function beforeAll(done) { // eslint-disable-line prefer-arrow-callback
    api = new CustomApi(WebSocket);
    observer.register('api.error', (_response) => {
      response = _response;
      done();
    }, true);
    api.authorize('FakeToken');
  });
  it('Authorize should fail', () => {
    expect(response).to.have.deep.property('.code')
      .that.is.equal('InvalidToken');
  });
});
