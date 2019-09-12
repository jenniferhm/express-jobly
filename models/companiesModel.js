const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const queryStringReader = require("../helpers/queryStringReader");


class Company {

  static async filteredGet(query) {
    let finalQuery = queryStringReader(query);

    const result = await db.query(
      `${finalQuery.baseQuery}`, finalQuery.queryValues
    );
    
    let companies = result.rows;

    return companies;
  }

  static async create({ handle, name, num_employees, description, logo_url }) {
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

  static async getById(handle) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
      FROM companies
      WHERE handle=$1`,
      [handle]
    )

    if (result.rows[0].length === 0) {
      throw new ExpressError("Company not found!")
    }

    let company = result.rows[0];
    return company;
  }

  static async patch(handle, items, key, id) {
    let update = sqlForPartialUpdate("companies", items, key, id)
    let itemsArr = Object.values(items); 
    itemsArr.push(itemsArr.length);

    const result = await db.query(
      `${update.query}`,
      itemsArr
    )
    // don't need to wrap update.values in an array since it's
    // already an array
    if (result.rows[0].length === 0) {
      throw new ExpressError("Company not found!", 404);
    }

    let updatedCompany = result.rows[0];
    return updatedCompany;

  }

  static async delete(handle) {
    const result = await db.query(`DELETE
    FROM companies 
    WHERE handle=$1
    RETURNING handle`,
      [handle])

    if (result.rows[0].length === 0) {
      throw new ExpressError("No such company", 404);
    }

    let deleted = "Company deleted";
    return deleted;
  }
}

module.exports = Company;