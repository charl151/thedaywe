export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const GELATO_KEY = process.env.GELATO_API_KEY;
    const body = req.body;

    const r = await fetch("https://order.gelatoapis.com/v4/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": GELATO_KEY,
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: "Gelato error", detail: data });
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
