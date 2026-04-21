const Razorpay = require('razorpay');

// PASTE YOUR KEYS HERE MANUALLY FOR A QUICK TEST
const key_id = 'rzp_test_Sg8uKAkasDWj4C';
const key_secret = 'IorjLdqTZDRGJ0Ow7g6ixPP9';

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

async function test() {
  console.log('Testing Razorpay with Key ID:', key_id);
  try {
    const order = await razorpay.orders.create({
      amount: 100, // 1 INR
      currency: 'INR',
      receipt: 'test_receipt',
    });
    console.log('✅ SUCCESS! Order created:', order.id);
  } catch (err) {
    console.error('❌ FAILED!');
    console.error('Status Code:', err.statusCode);
    console.error('Error Data:', JSON.stringify(err.error, null, 2));
  }
}

test();
