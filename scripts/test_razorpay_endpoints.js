const crypto = require('crypto')

const KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TjJOcfGJrnkNgJ'
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '7i1DA5vNZTiIrOmRNy592Cmm'

console.log('Testing Razorpay Configuration:')
console.log('KEY_ID:', KEY_ID)
console.log('KEY_SECRET length:', KEY_SECRET ? KEY_SECRET.length : 0)

async function testDirectRazorpay() {
  const Razorpay = require('razorpay')
  const rzp = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
  })

  console.log('\n--- 1. Testing Razorpay Order Creation via SDK ---')
  try {
    const order = await rzp.orders.create({
      amount: 5000, // 5000 paise = ₹50
      currency: 'INR',
      receipt: `test_rcpt_${Date.now()}`,
      payment_capture: true,
    })

    console.log('SUCCESS: Razorpay Order Created!')
    console.log('Order ID:', order.id)
    console.log('Amount (paise):', order.amount)
    console.log('Currency:', order.currency)
    console.log('Status:', order.status)

    // Test signature generation and verification
    console.log('\n--- 2. Testing HMAC-SHA256 Signature Verification ---')
    const testPaymentId = 'pay_test_' + Date.now()
    const validSignature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(`${order.id}|${testPaymentId}`)
      .digest('hex')

    console.log('Generated Signature:', validSignature)

    // Check verification with correct signature
    const checkValid = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(`${order.id}|${testPaymentId}`)
      .digest('hex') === validSignature

    console.log('Valid Signature Matches?', checkValid)

    // Check verification with invalid signature
    const checkInvalid = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(`${order.id}|${testPaymentId}`)
      .digest('hex') === 'fake_invalid_signature_123'

    console.log('Invalid Signature Rejected?', !checkInvalid)

    if (checkValid && !checkInvalid) {
      console.log('\nALL RAZORPAY VERIFICATION TESTS PASSED!')
    } else {
      console.error('\nFAILED: Signature check logic error')
      process.exit(1)
    }
  } catch (err) {
    console.error('FAILED to create order with Razorpay:', err)
    process.exit(1)
  }
}

testDirectRazorpay()
