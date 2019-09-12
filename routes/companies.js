const express = require("express");
const router = new express.Router();
const Company = require("../models/companiesModel");
const validate = require("jsonschema");
const companySchema = require("../schemas/companySchema");
const ExpressError = require("../helpers/expressError");


router.get("/", async function(req, res, next) {
  try{
    let companies = await Company.filteredGet(req.query);
    return res.json({companies});
  } catch(err) {
    return next(err);
  }
})

router.post("/", async function(req, res, next) {
  try {
    const result = validate.validate(req.body, companySchema);
    if(!result.valid) {
     let listOfErrors = result.errors.map(error => error.stack);
     let error = new ExpressError(listOfErrors, 400);
     return next(error);
    }

    const { handle, name, num_employees, description, logo_url } = req.body;
    const company = await Company.create({ handle, name, num_employees, description, logo_url });

    return res.json({company}, 201);
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
    // const result = validate.validate(req.body, companySchema);
    // if(!result.valid) {
    //  let listOfErrors = result.errors.map(error => error.stack);
    //  let error = new ExpressError(listOfErrors, 400);
    //  return next(error);
    // }

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


