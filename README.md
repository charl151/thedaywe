# The Day We — Personalised Star Maps

> Capture the exact night sky from any moment in time.  
> [thedaywe.com](https://thedaywe.com)

## Tech Stack

- **React 18** + **Vite 5**
- Zero external dependencies — all star math & canvas rendering is pure JS
- Fully client-side (no backend needed)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
# Output goes to ./dist/
```

---

## Deploy to Vercel via GitHub

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — The Day We star map app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thedaywe.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo (`thedaywe`)
3. Vercel auto-detects Vite — leave all settings as default
4. Click **Deploy**

### 3. Add Custom Domain

1. In Vercel project settings → **Domains**
2. Add `thedaywe.com` and `www.thedaywe.com`
3. Update your DNS registrar with the records Vercel provides:
   - `A` record: `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`

DNS propagation takes ~5–30 minutes.

---

## Project Structure

```
thedaywe/
├── public/
│   └── favicon.svg          # Star icon
├── src/
│   ├── App.jsx              # Main star map application
│   ├── main.jsx             # React entry point
│   └── index.css            # Global reset
├── index.html               # HTML shell
├── vite.config.js
├── vercel.json              # Vercel deployment config
└── package.json
```

---

## Branding

- **App header**: "The Day We" with subtitle "Personalised Star Maps"
- **Downloaded file**: `thedaywe-star-map.png`
- **Poster watermark**: `thedaywe.com` (subtle, bottom of every generated poster)
- **Page title**: "The Day We — Personalised Star Maps"
