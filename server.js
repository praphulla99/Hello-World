const express = require('express');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'menu.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function findRestaurant(slug) {
  const data = readData();
  return data.restaurants.find((r) => r.slug === slug);
}

app.get('/api/restaurants', (req, res) => {
  const data = readData();
  const restaurants = data.restaurants.map((r) => ({
    slug: r.slug,
    name: r.name,
    currency: r.currency,
    whatsapp: r.whatsapp
  }));
  res.json(restaurants);
});

app.get('/api/menu/:slug', (req, res) => {
  const restaurant = findRestaurant(req.params.slug);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  return res.json(restaurant);
});

app.get('/menu/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

app.get('/qr/:slug/:table', async (req, res) => {
  const { slug, table } = req.params;
  const restaurant = findRestaurant(slug);
  if (!restaurant) {
    return res.status(404).send('Restaurant not found');
  }

  const menuUrl = `${req.protocol}://${req.get('host')}/menu/${slug}?table=${encodeURIComponent(table)}`;

  try {
    const png = await QRCode.toBuffer(menuUrl, {
      type: 'png',
      width: 420,
      margin: 2
    });
    res.setHeader('Content-Type', 'image/png');
    return res.send(png);
  } catch (error) {
    return res.status(500).send('Failed to generate QR');
  }
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Restaurant menu software is running on http://localhost:${PORT}`);
});
