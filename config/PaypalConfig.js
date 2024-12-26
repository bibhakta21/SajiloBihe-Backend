const paypal = require('@paypal/checkout-server-sdk');

function environment() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;
    return new paypal.core.SandboxEnvironment(clientId, clientSecret); 
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };
