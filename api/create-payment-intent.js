export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { paymentMethodId, amount, currency, description, custEmail } = req.body;
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    const createRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: currency.toLowerCase(),
        payment_method: paymentMethodId,
        confirmation_method: "manual",
        confirm: "true",
        description,
        receipt_email: custEmail,
        "return_url": "https://www.thedaywe.com",
      }).toString()
    });

    const intent = await createRes.json();
    if (intent.error) return res.status(400).json({ error: intent.error.message });
    if (intent.status === "succeeded") return res.status(200).json({ ok: true, paymentIntentId: intent.id });
    if (intent.status === "requires_action") return res.status(200).json({ requiresAction: true, clientSecret: intent.client_secret });
    return res.status(400).json({ error: "Payment failed with status: " + intent.status });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
