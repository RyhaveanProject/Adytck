const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../lib/store');
const stations = require('../data/stations.json').stations;
const schedules = require('../data/schedules.json');

router.get('/ticket-search', (req, res) => {
  res.render('tickets/search', {
    title: 'Ticket search',
    active: 'tickets',
    stations,
    query: {}
  });
});

router.get('/ticket-search/results', (req, res) => {
  const { from, to, date, passengers } = req.query;
  let results = schedules.trains;
  if (from) results = results.filter(t => t.from === from);
  if (to) results = results.filter(t => t.to === to);
  const fromStation = stations.find(s => s.code === from);
  const toStation = stations.find(s => s.code === to);
  res.render('tickets/results', {
    title: 'Results',
    active: 'tickets',
    trains: results,
    stations,
    query: { from, to, date, passengers: passengers || 1 },
    fromStation,
    toStation
  });
});

router.get('/ticket/:no', (req, res) => {
  const { no } = req.params;
  const { date = '', passengers = 1 } = req.query;
  const train = schedules.trains.find(t => t.no === no);
  if (!train) return res.status(404).render('404', { title: '404' });
  const fromStation = stations.find(s => s.code === train.from);
  const toStation = stations.find(s => s.code === train.to);
  res.render('tickets/seats', {
    title: 'Seats - ' + train.no,
    active: 'tickets',
    train,
    fromStation,
    toStation,
    date,
    passengers: parseInt(passengers, 10) || 1
  });
});

router.post('/ticket/:no/buy', (req, res) => {
  if (!req.session.user) {
    req.session.flash = { type: 'error', message: res.locals.t.error + ': login first' };
    return res.redirect('/auth/login');
  }
  const { no } = req.params;
  const { date, seat, wagon } = req.body;
  const train = schedules.trains.find(t => t.no === no);
  if (!train) return res.status(404).render('404', { title: '404' });
  const orders = readJson('orders', []);
  const order = {
    id: 'ord_' + Date.now(),
    userId: req.session.user.id,
    trainNo: no,
    from: train.from,
    to: train.to,
    date: date || new Date().toISOString().slice(0, 10),
    seat: seat || '1',
    wagon: wagon || 'A1',
    price: train.price,
    status: 'awaiting_payment',
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  writeJson('orders', orders);
  res.redirect('/payment/' + order.id);
});

module.exports = router;
