export default async function handler(req, res) {
  // Allow CORS from any origin (it's our own frontend calling this)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { toName, toEmail, orderNumber, isDigital, isPhysical, downloadUrls, title, locationName, dateStr } = req.body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const OWNER_EMAIL    = "thedaywe@gmail.com";
    const FROM_EMAIL     = "orders@thedaywe.com";

    const firstName = (toName || "").split(" ")[0] || "there";

    const digitalSection = isDigital && downloadUrls ? `
      <div style="margin:32px 0;text-align:center;">
        <p style="font-size:13px;color:#555;margin-bottom:20px;font-family:Arial,sans-serif;">Your print-ready files are ready to download. Each PDF is sized for professional printing.</p>
        ${Object.entries(downloadUrls).map(([key, url]) => {
          const labels = { "8x10": '8×10" (20×25 cm)', "12x16": '12×16" (30×40 cm)' };
          return `<a href="${url}" style="display:inline-block;margin:6px 8px;padding:14px 28px;background:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:8px;font-size:12px;letter-spacing:0.1em;font-family:Georgia,serif;">
            ↓ Download ${labels[key] || key} PDF
          </a>`;
        }).join("")}
        <p style="font-size:11px;color:#999;margin-top:16px;font-family:Arial,sans-serif;">Files are hosted securely — links do not expire.</p>
      </div>` : "";

    const physicalSection = isPhysical ? `
      <div style="margin:32px 0;padding:20px;background:#f8f8f8;border-radius:8px;">
        <p style="margin:0 0 8px;font-size:13px;color:#333;font-family:Arial,sans-serif;">🖨️ Your print is being prepared</p>
        <p style="margin:0 0 8px;font-size:13px;color:#333;font-family:Arial,sans-serif;">📦 Printed and shipped within 3–5 business days</p>
        <p style="margin:0;font-size:13px;color:#333;font-family:Arial,sans-serif;">📧 Tracking info will be emailed to you separately</p>
      </div>` : "";

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    <div style="background:#1a1a1a;padding:40px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;">The Day We</p>
      <h1 style="margin:0;font-size:28px;font-weight:300;font-style:italic;color:#ffffff;">Your Star Map is Ready</h1>
    </div>
    <div style="padding:40px 32px;">
      <p style="font-size:15px;color:#333;margin:0 0 8px;">Hi ${firstName},</p>
      <p style="font-size:13px;color:#555;line-height:1.8;margin:0 0 24px;font-family:Arial,sans-serif;">
        Thank you for your order. Your personalised star map${title ? ` — <em>${title}</em>` : ""}
        has been created just for you${locationName ? `, capturing the sky over ${locationName}` : ""}${dateStr ? ` on ${dateStr}` : ""}.
      </p>
      ${digitalSection}
      ${physicalSection}
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0;"/>
      <p style="font-size:10px;color:#999;text-align:center;letter-spacing:0.1em;font-family:Arial,sans-serif;">Order ${orderNumber} · thedaywe.com</p>
      <p style="font-size:11px;color:#aaa;text-align:center;font-family:Arial,sans-serif;">
        Any questions? Reply to this email or contact
        <a href="mailto:thedayweprints@gmail.com" style="color:#aaa;">thedayweprints@gmail.com</a>
      </p>
    </div>
  </div>
</body></html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `The Day We <${FROM_EMAIL}>`,
        to: [toEmail],
        bcc: [OWNER_EMAIL],
        subject: `Your Star Map is Ready — Order ${orderNumber}`,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Resend error", detail: data });
    return res.status(200).json({ ok: true, id: data.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
