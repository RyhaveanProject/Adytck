const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../lib/store');
const stations = require('../data/stations.json').stations;

router.get('/payment/:orderId', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const orders = readJson('orders', []);
  const order = orders.find(o => o.id === req.params.orderId && o.userId === req.session.user.id);
  if (!order) return res.status(404).render('404', { title: '404' });
  const from = stations.find(s => s.code === order.from);
  const to = stations.find(s => s.code === order.to);
  res.render('payment/pay', {
    title: 'Payment',
    active: 'tickets',
    order,
    from, to
  });
});

router.post('/payment/:orderId', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const { card_number, card_holder, expiry, cvv } = req.body;
  if (!card_number || !card_holder || !expiry || !cvv) {
    req.session.flash = { type: 'error', message: res.locals.t.required_field };
    return res.redirect('back');
  }
  // Save card to digital wallet (masked)
  const cards = readJson('cards', []);
  const last4 = card_number.replace(/\s/g, '').slice(-4);
  cards.push({
    id: 'c_' + Date.now(),
    userId: req.session.user.id,
    holder: card_holder,
    last4,
    addedAt: new Date().toISOString()
  });
  writeJson('cards', cards);
  // Mark order as paid
  const orders = readJson('orders', []);
  const order = orders.find(o => o.id === req.params.orderId && o.userId === req.session.user.id);
  if (order) {
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    writeJson('orders', orders);
  }
  req.session.flash = { type: 'success', message: res.locals.t.payment_success };
  res.redirect('/payment/' + req.params.orderId + '/success');
});

router.get('/payment/:orderId/success', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const orders = readJson('orders', []);
  const order = orders.find(o => o.id === req.params.orderId && o.userId === req.session.user.id);
  if (!order) return res.status(404).render('404', { title: '404' });
  const from = stations.find(s => s.code === order.from);
  const to = stations.find(s => s.code === order.to);
  res.render('payment/success', { title: 'Payment success', active: 'tickets', order, from, to });
});

router.get('/balance', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  res.render('payment/balance', { title: 'Top-up balance', active: 'tickets' });
});

router.post('/balance', (req, res) => {
  const { amount } = req.body;
  req.session.flash = { type: 'success', message: res.locals.t.balance_add + ': ' + amount + ' AZN' };
  res.redirect('/balance');
});

module.exports = router;
