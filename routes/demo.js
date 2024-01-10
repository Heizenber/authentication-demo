const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("welcome");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", async (req, res) => {
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;
  const confirmEmail = userData["confirm-email"];

  if (
    !email ||
    !password ||
    !confirmEmail ||
    email !== confirmEmail ||
    !email.includes("@")
  ) {
    console.log("Invalid input");
    return res.redirect("/signup");
  }

  const existingUser = await db.getDb().collection('users').findOne({ email: email });

  if (existingUser) {
    console.log('User already exists');
    return res.redirect('/signup');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    email: email,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);

  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;

  const user = await db.getDb().collection("users").findOne({ email: email });

  if (!user) {
    return res.redirect("/login");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.redirect("/login");
  }

  res.redirect("/admin");
});

router.get("/admin", (req, res) => {
  res.render("admin");
});

router.post("/logout", (req, res) => {});

module.exports = router;
