const test = require('ava');
const axios = require('axios');
const sinon = require('sinon');
const { createOrder } = require('../src/binance');

test.beforeEach(t => {
  t.context.sandbox = sinon.createSandbox();
  t.context.axiosPostStub = t.context.sandbox.stub(axios, 'post');
});

test.afterEach.always(t => {
  t.context.sandbox.restore();
});

test('createOrder should create a new order successfully', async t => {
  const apiKey = 'testApiKey';
  const apiSecret = 'testApiSecret';
  const symbol = 'BTCUSDT';
  const side = 'BUY';
  const type = 'LIMIT';
  const quantity = 1;
  const price = 50000;

  const responseData = { orderId: 12345 };
  t.context.axiosPostStub.resolves({ data: responseData });

  const result = await createOrder(apiKey, apiSecret, symbol, side, type, quantity, price);

  t.deepEqual(result, responseData);
});

test('createOrder should throw an error if the order creation fails', async t => {
  const apiKey = 'testApiKey';
  const apiSecret = 'testApiSecret';
  const symbol = 'BTCUSDT';
  const side = 'BUY';
  const type = 'LIMIT';
  const quantity = 1;
  const price = 50000;

  t.context.axiosPostStub.rejects(new Error('Order creation failed'));

  const error = await t.throwsAsync(() => createOrder(apiKey, apiSecret, symbol, side, type, quantity, price));

  t.is(error.message, 'Failed to create order: Order creation failed');
});
