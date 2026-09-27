const express = require('express');
const router = express.Router();
const schedules = require('../data/schedules.json');
const stations = require('../data/stations.json').stations;

router.get('/schedule', (req, res) => {
  const type = req.query.type || 'absheron';
  let tab = 'absheron';
  if (type === 'domestic') tab = 'domestic';
  res.render('schedule/index', {
    title: 'Timetable',
    active: 'schedule',
    schedules,
    stations,
    tab
  });
});

module.exports = router;
