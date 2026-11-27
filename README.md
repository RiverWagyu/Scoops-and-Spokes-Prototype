# Scoops & Spokes — Photo-booth receipt + เซียมซี prototype

Two web pages:

| Page | Who uses it | What it does |
|---|---|---|
| `index.html` | Cashier (laptop/tablet) | Take the order → snap 3 photo-booth shots with the camera → print a receipt. **Front:** order + QR code. **Back:** the photo strip. |
| `fortune.html` | Customer (phone, via QR) | Shake the เซียมซี tube → read today's fortune (TH/EN) → if lucky (25%), spin the wheel → get a coupon (10% / 15% / 20% off, or a free upsize). |

## Run it

1. Double-click **`start.command`** (or in Terminal: `cd` into this folder and run `python3 -m http.server 8000`).
2. Open **http://localhost:8000/** in Chrome on the laptop. The camera only works on `localhost` or `https://`.

### Make the QR work on phones
Phones can't open `localhost`. Pick one:

- **Same Wi-Fi (quick):** `start.command` prints a line like `http://192.168.1.20:8000/`. In the cashier page, open **Settings** and paste that address. Phones on the same Wi-Fi can now scan. (University Wi-Fi sometimes blocks this. If so, use a phone hotspot or the next option.)
- **Put it online (best for class):** upload this whole folder to GitHub Pages or Netlify. You get an `https://` address that works from any phone, and the camera works on the hosted cashier page too. Put that address in **Settings**, or set `fortuneBaseUrl` in `js/config.js`.

## Printing (front + back)
Click **Print**. Page 1 is the front and page 2 is the photo side. Turn on **two-sided printing → flip on long edge**, then cut along the dashed outline.

## Presenting tips
- `fortune.html?demo=lucky` always gives a lucky draw, so the wheel shows up during your demo.
- `fortune.html?demo=1` gives a random draw that follows the real 25% odds.
- Each receipt number always gives the **same** fortune and prize on any phone, so re-scanning can't re-roll the luck.
- **Check coupon** (cashier page): type the receipt number from the customer's coupon to see the prize, whether it's expired, and to mark it as used.

## Change things
Everything lives in **`js/config.js`**:
- `mascotSrc` — the dino mascot (`assets/mascot.png`), cut out of the shop's profile picture (`assets/mascot-original.jpg`). If you get the original high-res file from the shop, drop it in `assets/` and point this at it.
- The "&" logo (`assets/amp-mark.svg`) and the SC◎◎PS & SP◎KES wordmark are redrawn copies of the shop's logo. Swap in the official files if you get them.
- `menu` — item names (TH/EN) and prices. **These are placeholders. Swap in the real menu.**
- `luckyChance` — `0.25` = 25% of receipts are lucky.
- `prizes` — wheel prizes and their weights (now 45 / 30 / 15 / 10).
- `couponValidDays` — coupon lifetime (now 14 days, to bring customers back).
- `shareValidDays` — free scoop for posting the receipt on social media (now 30 days). The customer shows their post + the **receipt number** (`S…`, on the front) on the next visit.
- **Wheel prize codes** start with `W` (e.g. `W261127-B7KQ9M`), appear only on the customer's phone after spinning, and are separate from the receipt number. The letter after the dash says which prize it is. Both kinds of code are checked and marked as used under **Check coupon**.

The 28 fortune sticks (TH + EN) are in `js/fortunes.js`.

## Prototype limits
- There is no server or database. "Used" coupons are remembered only on the cashier device, in the browser's storage.
- Fortunes are worked out in the browser, so someone technical could predict them. That's fine for a class prototype, but a real launch would need a small backend.
- The QR code library loads from the internet (jsDelivr), and so do the fonts.
