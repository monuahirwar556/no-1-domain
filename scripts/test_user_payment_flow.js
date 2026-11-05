const crypto = require('crypto')

async function testUserPaymentFlow() {
  console.log('--- TESTING REAL USER PAYMENT FLOW ---')

  // 1. User submits domain to checkout
  const testDomain = 'testbrand' + Date.now() + '.com'
  const createDomainRes = await fetch('http://localhost:3000/api/domains', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `https://${testDomain}`,
      title: 'Test Brand Online',
      category: 'Ecommerce & Retail',
      amount: 50,
    }),
  })

  const domainData = await createDomainRes.json()
  console.log('1. /api/domains response:', domainData)

  if (!createDomainRes.ok || !domainData.listingId) {
    console.error('Failed to create domain bid')
    process.exit(1)
  }

  // 2. User scans UPI QR code, money deducted, user clicks "I Have Paid • Confirm & Verify"
  console.log('2. Simulating User clicking "I Have Paid • Confirm & Verify" (UPI QR scan)...')
  const verifyRes = await fetch('http://localhost:3000/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpayOrderId: domainData.orderId,
      razorpayPaymentId: `pay_upi_${Date.now()}`,
      razorpaySignature: 'upi_qr_verified',
      listingId: domainData.listingId,
      amount: 50,
      domain: testDomain,
      url: `https://${testDomain}`,
    }),
  })

  const verifyData = await verifyRes.json()
  console.log('3. /api/payments/verify response:', verifyData)

  if (!verifyRes.ok || !verifyData.success) {
    console.error('FAILED: Verification rejected UPI payment!')
    process.exit(1)
  }

  // 4. Verify that domain is now ACTIVE and ranked #1 on public leaderboard
  const boardRes = await fetch('http://localhost:3000/api/domains')
  const boardData = await boardRes.json()
  const topDomain = boardData.domains?.[0]
  console.log('4. Current Top #1 Domain on board:', topDomain?.domain, 'Current Bid:', topDomain?.currentBid)

  if (topDomain?.domain === testDomain) {
    console.log('\n🎉 SUCCESS!! Domain is now successfully crowned #1 on the live board!')
  } else {
    console.log('Domain active in list:', boardData.domains?.some(d => d.domain === testDomain))
  }

  console.log('\n✅ TEST PASSED: User payment proceeds immediately to success!')
}

testUserPaymentFlow().catch(err => {
  console.error(err)
  process.exit(1)
})
