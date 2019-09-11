const db = require("../db");
const ExpressError = require("../helpers/expressError");


class Company {

  // static async all() {
  //   const companies = await db.query(
  //       `SELECT `
  //   )
  // }

  static async create({ handle, name, num_employees, description, logo_url}) {
    const result = await db.query(
      `INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING handle, name, num_employees, description, logo_url`,
        [handle, name, num_employees, description, logo_url]
    );

    let company = result.rows[0];
    return company;
  }







}

module.exports = Company;