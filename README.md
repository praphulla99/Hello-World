# Restaurant Menu Software (WhatsApp + QR/Web)

This project is a lightweight digital restaurant menu system that customers can access by scanning a QR code (barcode scan flow) or by opening a web link.

## Features

- Serve digital menu pages per restaurant (`/menu/:slug`).
- Generate table-specific QR codes (`/qr/:slug/:table`) pointing to menu links.
- One-click WhatsApp ordering for each menu item with a pre-filled message that includes the table number.
- Simple JSON-based menu configuration (`data/menu.json`).

## Quick start

```bash
npm install
npm start
```

Then open:

- Dashboard: `http://localhost:3000/`
- Example menu: `http://localhost:3000/menu/sunset-bistro?table=1`
- Example QR image: `http://localhost:3000/qr/sunset-bistro/1`

## Data model

Update `data/menu.json` to add more restaurants, categories, and items.

Required restaurant fields:

- `slug` (URL-safe id)
- `name`
- `whatsapp` (international format, digits only)
- `currency` (ISO code, e.g., `USD`)
- `categories[]` with `items[]`

## Production ideas

- Add admin authentication + menu editor UI.
- Persist data in PostgreSQL/MySQL.
- Integrate with WhatsApp Business API webhooks for full order status tracking.
- Add multilingual support and allergen filters.
