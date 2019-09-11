const express = require("express");
const router = new express.Router();
const Company = require("../models/companiesModel");


router.post("/", async function(req, res, next) {
  try {
    const { handle, name, num_employees, description, logo_url } = req.body;
    const company = await Company.create({ handle, name, num_employees, description, logo_url });

    return res.json({company});
  } catch (err) {
    return next(err);
  }
})





module.exports = router;