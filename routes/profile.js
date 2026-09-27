const express = require('express');
const router = express.Router();
const { readJson } = require('../lib/store');
const stations = require('../data/stations.json').stations;

router.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const orders = readJson('orders', []).filter(o => o.userId === req.session.user.id);
  const cards = readJson('cards', []).filter(c => c.userId === req.session.user.id);
  // Enrich with station info
  const enriched = orders.map(o => ({
    ...o,
    fromName: (stations.find(s => s.code === o.from) || {}).name || o.from,
    toName: (stations.find(s => s.code === o.to) || {}).name || o.to
  }));
  res.render('profile/index', {
    title: 'Profile',
    active: 'profile',
    orders: enriched,
    cards
  });
});

router.get('/profile/return/:orderId', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  // Refund logic: status -> 'returned' (50% rule applies in real DB)
  res.render('profile/return', { title: 'Return ticket', active: 'profile', orderId: req.params.orderId });
});

module.exports = router;
