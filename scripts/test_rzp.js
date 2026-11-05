const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');

async function main() {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['razorpay_key_id', 'razorpay_key_secret', 'razorpay_live_mode']
      }
    }
  });
  console.log('Database Settings:', settings);

  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_live_TtJd2an6QYjilM';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'blxpBpB5MQYUrWo35a2ZMPsM';
  console.log('Testing Razorpay with Key ID:', key_id, 'Secret length:', key_secret.length);

  const rzp = new Razorpay({
    key_id,
    key_secret
  });

  try {
    const order = await rzp.orders.create({
      amount: 5000,
      currency: 'INR',
      receipt: 'test_rcpt_1'
    });
    console.log('SUCCESS! Razorpay Order created:', order.id);
  } catch (err) {
    console.error('FAILED Razorpay order test:', err);
  }
}

main().finally(() => prisma.$disconnect());
