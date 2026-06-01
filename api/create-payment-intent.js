const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, currency = 'usd', size, qty } = req.body;

  if (!amount || amount < 100) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { size, qty: String(qty), product: 'FootZen Slippers' },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
