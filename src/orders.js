const axios = require('axios');
const crypto = require('crypto');

async function createNewOrder(apiKey, apiSecret, symbol, side, type, quantity, price) {
  const endpoint = 'https://api.binance.com/api/v3/order';
  const timestamp = Date.now();
  const data = {
    symbol,
    side,
    type,
    quantity,
    price,
    timestamp,
  };

  const signature = generateSignature(apiSecret, data);
  const headers = {
    'X-MBX-APIKEY': apiKey,
  };

  try {
    const response = await axios.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
}

function generateSignature(secret, data) {
  const query = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

module.exports = {
  createNewOrder,
};
