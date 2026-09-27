// ADY Ticket Clone - main server
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const methodOverride = require('method-override');

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const scheduleRoutes = require('./routes/schedule');
const paymentRoutes = require('./routes/payment');
const profileRoutes = require('./routes/profile');
const infoRoutes = require('./routes/info');

const { initStorage } = require('./lib/store');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'ady-clone-secret-key-change-in-production';

// Initialize data storage (creates JSON files if missing)
initStorage();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Sessions (in-memory; for production free tier set up Memory store)
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax'
    }
  })
);

// Make user + active language available to all views
app.use((req, res, next) => {
  res.locals.lang = req.cookies.lang || req.query.lang || 'az';
  res.locals.t = require('./lib/i18n')(res.locals.lang);
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/az', (req, res, next) => { res.cookie('lang', 'az'); res.redirect(req.originalUrl.replace(/^\/az/, '') || '/'); });
app.use('/en', (req, res, next) => { res.cookie('lang', 'en'); res.redirect(req.originalUrl.replace(/^\/en/, '') || '/'); });
app.use('/ru', (req, res, next) => { res.cookie('lang', 'ru'); res.redirect(req.originalUrl.replace(/^\/ru/, '') || '/'); });
app.use('/az/', (req, res, next) => { res.cookie('lang', 'az'); next(); });
app.use('/en/', (req, res, next) => { res.cookie('lang', 'en'); next(); });
app.use('/ru/', (req, res, next) => { res.cookie('lang', 'ru'); next(); });
app.use('/', ticketRoutes);
app.use('/', scheduleRoutes);
app.use('/', paymentRoutes);
app.use('/', profileRoutes);
app.use('/', infoRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

app.listen(PORT, () => {
  console.log(`ADY clone server is running on port ${PORT}`);
});

module.exports = app;
