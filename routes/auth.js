const express = require("express");
const router = new express.Router();
const User = require("../models/usersModel");
const ExpressError = require("../helpers/expressError");
const jsonschema = require("jsonschema");
const userSchema = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const JWT_OPTIONS = { expiresIn: 60 * 60 };
const { SECRET_KEY } = require("../config");
const {authenticateJWT} = require("../helpers/auth");


router.post("/register", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, userSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const { username, password, first_name, last_name, email, photo_url, is_admin } = req.body;
    const user = await User.create({
      username,
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
    });
    
    if (user) {
      let payload = { username: username, is_admin: is_admin };
      let _token = await jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
      return res.json({ _token }, 201);
    } else {
      throw new ExpressError("Registration failed.", 400);
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/login", authenticateJWT, async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);

    if (user) {
      let _token = req.body._token;
      return res.json({ _token });
    } else {
      throw new ExpressError('Invalid user/password!', 401);
    }
  } catch (err) {
    return next(err);
  }
})

module.exports = router;