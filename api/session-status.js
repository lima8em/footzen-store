const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.status(200).json({
      status: session.payment_status,
      email: session.customer_details?.email,
      size: session.metadata?.size,
      qty: session.metadata?.qty,
      total: (session.amount_total / 100).toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
