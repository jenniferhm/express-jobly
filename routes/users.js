const express = require("express");
const router = new express.Router();
const User = require("../models/usersModel");
const jsonschema = require("jsonschema");
// const userSchema = require("../schemas/userSchema");
const userPatchSchema = require("../schemas/userPatchSchema");
const ExpressError = require("../helpers/expressError");

router.get("/", async function (req, res, next) {
  try {
    let users = await User.all();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username", async function(req, res, next) {
  try {
    let user = await User.getByUsername(req.params.username);
    return res.json({user});
  } catch (err) {
    return next(err);
  }
});

router.patch("/:username", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body.items, userPatchSchema);
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const username = req.params.username;
    const { items } = req.body;
    const user = await User.patch(items, username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:username", async function (req, res, next) {
  try {
    const username = req.params.username;
    const message = await User.delete(username);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
})

module.exports = router;