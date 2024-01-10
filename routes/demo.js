const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/database');


const router = express.Router();

router.get('/',  (req, res) => {
  res.render('welcome');
});

router.get('/signup',  (req, res) => {
  res.render('signup');
});

router.get('/login',  (req, res) => {
  res.render('login');
});

router.post('/signup', async (req, res) => {
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;
  const confirmEmail = userData['confirm-email'];

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    email: email,
    password: hashedPassword,
  }

  await db.getDb().collection('users').insertOne(user);

  res.redirect('/login');
});

router.post('/login', async (req, res) => {
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;

  const user = await db.getDb().collection('users').findOne({ email: email });

  if (!user) {
    return res.redirect('/login');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (isValid) {
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save(function (err) {
      res.redirect('/admin');
    });
  }

  res.redirect('/login');
});

router.get('/admin',  (req, res) => {
  res.render('admin');
});

router.post('/logout',  (req, res) => {});

module.exports = router;
