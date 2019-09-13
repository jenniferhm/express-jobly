const express = require("express");
const router = new express.Router();
const Job = require("../models/jobsModel");
const jsonschema = require("jsonschema");
const jobSchema = require("../schemas/jobSchema");
const jobPatchSchema = require("../schemas/jobPatchSchema");
const ExpressError = require("../helpers/expressError");
const { authenticateJWT, ensureLoggedIn, ensureIsAdmin } = require("../helpers/auth");

router.post("/", authenticateJWT, ensureLoggedIn, ensureIsAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, jobSchema);
    
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const { title, salary, equity, company_handle } = req.body;
    const job = await Job.create({
      title,
      salary,
      equity,
      company_handle
    });

    return res.json({ job }, 201);
  } catch (err) {
    return next(err);
  }
});

router.get("/", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
  try {
    let jobs = await Job.filteredJobs(req.query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
  try {
    let { id } = req.params;
    let job = await Job.getById(id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", authenticateJWT, ensureLoggedIn, ensureIsAdmin, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body.items, jobPatchSchema);
    
    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const { id } = req.params;
    const { items } = req.body;
    const job = await Job.patch(items, id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", authenticateJWT, ensureLoggedIn, ensureIsAdmin, async function (req, res, next) {
  try {
    const { id } = req.params;
    const message = await Job.delete(id);
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;