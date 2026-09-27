const express = require('express');
const router = express.Router();
const stations = require('../data/stations.json').stations;

router.get('/popular-directions', (req, res) => {
  res.render('info/popular', { title: 'Popular directions', active: 'info', stations });
});

router.get('/dasima-qaydalari/usaqlarla-seyahet', (req, res) => {
  res.render('info/children', { title: 'Travelling with children', active: 'info' });
});

router.get('/dasima-qaydalari/el-yuklerinin-dasinmasi', (req, res) => {
  res.render('info/luggage', { title: 'Luggage rules', active: 'info' });
});

router.get('/dasima-qaydalari/heyvanlarin-dasinmasi', (req, res) => {
  res.render('info/pets', { title: 'Pets', active: 'info' });
});

router.get('/tarifler-ve-odenis', (req, res) => {
  res.render('info/tariffs', { title: 'Tariffs & Payment', active: 'info' });
});

router.get('/tarifler-ve-odenis/elektron-bilet', (req, res) => {
  res.render('info/eticket', { title: 'Electronic ticket', active: 'info' });
});

router.get('/tarifler-ve-odenis/gedis-haqqinin-qaytarilmasi', (req, res) => {
  res.render('info/refund', { title: 'Refund', active: 'info' });
});

router.get('/contact', (req, res) => {
  res.render('info/contact', { title: 'Contact', active: 'info' });
});

router.get('/about', (req, res) => {
  res.render('info/about', { title: 'About', active: 'info' });
});

router.post('/subscribe', (req, res) => {
  req.session.flash = { type: 'success', message: res.locals.t.subscribed };
  res.redirect('back');
});

router.get('/news', (req, res) => {
  res.render('info/news', { title: 'News', active: 'info' });
});

module.exports = router;
