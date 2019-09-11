const express = require("express");
const router = new express.Router();
const Company = require("../models/companiesModel");


router.get("/", async function(req, res, next) {
  let presentQueries = [];
  let { search, min_employees, max_employees } = req.query;
  if (search)
})

router.post("/", async function(req, res, next) {
  try {
    const { handle, name, num_employees, description, logo_url } = req.body;
    const company = await Company.create({ handle, name, num_employees, description, logo_url });

    return res.json({company});
  } catch (err) {
    return next(err);
  }
})

router.get("/:handle", async function(req, res, next) {
  try {
    const handle = req.params.handle;
    const company = await Company.getById(handle);
    return res.json({company});
  } catch (err) {
    return next(err);
  }
})

router.patch("/:handle", async function(req, res, next) {
  try {
    const handle = req.params.handle;
    const { items, key, id } = req.body;
    const company = await Company.patch(handle, items, key, id);
    return res.json({company});
  } catch (err) {
    return next(err);
  }
})

router.delete("/:handle", async function(req, res, next) {
  try {
    const handle = req.params.handle; 
    const message = await Company.delete(handle);
    return res.json({message});
  } catch (err) {
    return next(err);
  }
})


module.exports = router;


