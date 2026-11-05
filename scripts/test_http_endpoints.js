async function testHttpEndpoints() {
  console.log('Waiting for Next.js server to be ready on http://localhost:3000...')
  
  let ready = false
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:3000')
      if (res.status === 200 || res.status === 304 || res.status === 404) {
        ready = true
        break
      }
    } catch {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  if (!ready) {
    console.error('Server not reachable on http://localhost:3000')
    process.exit(1)
  }

  console.log('Server is UP! Testing POST /api/create-order...')

  // Test 1: Validation - amount < 100 paise rejected
  const invalidRes = await fetch('http://localhost:3000/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 50 }), // 50 paise is less than minimum 100
  })
  const invalidData = await invalidRes.json()
  console.log('Test 1 (min 100 paise validation): Status', invalidRes.status, invalidData.message)
  if (invalidRes.status !== 400) {
    console.error('FAILED Test 1')
    process.exit(1)
  }

  // Test 2: Valid Order Creation (amount 5000 paise = ₹50)
  const validRes = await fetch('http://localhost:3000/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 5000,
      currency: 'INR',
      receipt: `test_http_${Date.now()}`,
    }),
  })
  const validData = await validRes.json()
  console.log('Test 2 (valid order creation): Status', validRes.status)
  console.log('Test 2 Order Response:', validData)

  if (!validRes.ok || !validData.order_id) {
    console.error('FAILED Test 2')
    process.exit(1)
  }

  // Test 3: Verification - Missing fields rejected (400)
  const missingRes = await fetch('http://localhost:3000/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: validData.order_id,
      // missing payment_id and razorpay_signature
    }),
  })
  const missingData = await missingRes.json()
  console.log('Test 3 (missing fields validation): Status', missingRes.status, missingData.message)
  if (missingRes.status !== 400) {
    console.error('FAILED Test 3')
    process.exit(1)
  }

  // Test 4: Verification - Tampered / Invalid signature rejected (400)
  const fakeSigRes = await fetch('http://localhost:3000/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: validData.order_id,
      payment_id: 'pay_test_123',
      razorpay_signature: 'invalid_tampered_signature_hex_00000000000000000000000000000000',
    }),
  })
  const fakeSigData = await fakeSigRes.json()
  console.log('Test 4 (tampered signature rejected): Status', fakeSigRes.status, fakeSigData.message)
  if (fakeSigRes.status !== 400) {
    console.error('FAILED Test 4')
    process.exit(1)
  }

  // Test 5: Verification - Valid HMAC-SHA256 signature accepted (200)
  const crypto = require('crypto')
  const testPaymentId = 'pay_test_' + Date.now()
  const keySecret = '7i1DA5vNZTiIrOmRNy592Cmm'
  const validSig = crypto
    .createHmac('sha256', keySecret)
    .update(`${validData.order_id}|${testPaymentId}`)
    .digest('hex')

  const verifyRes = await fetch('http://localhost:3000/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: validData.order_id,
      payment_id: testPaymentId,
      razorpay_signature: validSig,
    }),
  })
  const verifyData = await verifyRes.json()
  console.log('Test 5 (valid signature verification): Status', verifyRes.status)
  console.log('Test 5 Verify Response:', verifyData)

  if (!verifyRes.ok || !verifyData.success) {
    console.error('FAILED Test 5')
    process.exit(1)
  }

  console.log('\n=======================================')
  console.log('ALL 5 HTTP API ENDPOINT TESTS PASSED!!')
  console.log('=======================================')
}

testHttpEndpoints().catch(e => {
  console.error(e)
  process.exit(1)
})
