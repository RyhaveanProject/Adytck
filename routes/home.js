const express = require('express');
const router = express.Router();
const { readJson } = require('../lib/store');

router.get('/', (req, res) => {
  const schedules = readJson('schedules', {});
  res.render('home', {
    title: 'ADY Ticket',
    active: 'home',
    schedules
  });
});

module.exports = router;
