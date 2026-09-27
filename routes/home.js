const express = require('express');
const router = express.Router();
const { readJson } = require('../lib/store');

router.get('/', (req, res) => {
  const schedules = readJson('schedules', {});
  // Stansiyaları da store-dan (və ya uyğun JSON faylından) oxuyuruq:
  const stations = readJson('stations', []); 

  res.render('home', {
    title: 'ADY Ticket',
    active: 'home',
    schedules,
    stations // <--- Bura mütləq əlavə edilməlidir!
  });
});

module.exports = router;
