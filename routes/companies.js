const express = require("express");
const router = new express.Router();
const Company = require("../models/companiesModel");
const jsonschema = require("jsonschema");
const companySchema = require("../schemas/companySchema");
const companyPatchSchema = require("../schemas/companyPatchSchema");
const ExpressError = require("../helpers/expressError");
const { authenticateJWT, ensureLoggedIn, ensureIsAdmin } = require("../helpers/auth");


router.get("/", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
  try {
    let companies = await Company.filteredCompanies(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
})

router.post("/", authenticateJWT, ensureLoggedIn, ensureIsAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, companySchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const { handle, name, num_employees, description, logo_url } = req.body;
    const company = await Company.create({
      handle,
      name,
      num_employees,
      description,
      logo_url
    });

    return res.json({ company }, 201);
  } catch (err) {
    return next(err);
  }
})

router.get("/:handle", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
  try {
    const { handle } = req.params;
    const company = await Company.getById(handle);
    return res.json(company);
  } catch (err) {
    return next(err);
  }
})

router.patch("/:handle", authenticateJWT, ensureLoggedIn, ensureIsAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body.items, companyPatchSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const { handle } = req.params;
    const { items } = req.body;
    const company = await Company.patch(items, handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
})

router.delete("/:handle", authenticateJWT, ensureLoggedIn, ensureIsAdmin, async function (req, res, next) {
  try {
    const { handle } = req.params;
    const message = await Company.delete(handle);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
})


module.exports = router;