const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { readJson, writeJson } = require('../lib/store');

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/profile');
  res.render('auth/login', { title: 'Login', active: 'login' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJson('users', []);
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    req.session.flash = { type: 'error', message: res.locals.t.invalid_credentials };
    return res.redirect('/auth/login');
  }
  req.session.user = { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone };
  res.redirect('/profile');
});

router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/profile');
  res.render('auth/register', { title: 'Register', active: 'register' });
});

router.post('/register', (req, res) => {
  const { firstname, lastname, email, phone, password, confirm_password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    req.session.flash = { type: 'error', message: res.locals.t.required_field };
    return res.redirect('/auth/register');
  }
  if (password !== confirm_password) {
    req.session.flash = { type: 'error', message: res.locals.t.error + ': password' };
    return res.redirect('/auth/register');
  }
  if (password.length < 6) {
    req.session.flash = { type: 'error', message: res.locals.t.password_hint };
    return res.redirect('/auth/register');
  }
  const users = readJson('users', []);
  if (users.find(u => u.email === email)) {
    req.session.flash = { type: 'error', message: res.locals.t.email_taken };
    return res.redirect('/auth/register');
  }
  const id = 'u_' + Date.now();
  const hashed = bcrypt.hashSync(password, 10);
  users.push({ id, firstname, lastname, email, phone, password: hashed });
  writeJson('users', users);
  req.session.user = { id, firstname, lastname, email, phone };
  req.session.flash = { type: 'success', message: res.locals.t.register_success };
  res.redirect('/profile');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
