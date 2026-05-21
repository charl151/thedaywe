import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { paymentMethodId, amount, currency, description, custName, custEmail } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
      description,
      receipt_email: custEmail,
      metadata: { custName, custEmail },
      return_url: "https://www.thedaywe.com",
    });

    if (paymentIntent.status === "succeeded") {
      return res.status(200).json({ ok: true, paymentIntentId: paymentIntent.id });
    } else if (paymentIntent.status === "requires_action") {
      return res.status(200).json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret
      });
    } else {
      return res.status(400).json({ error: "Payment failed", status: paymentIntent.status });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
