const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const { companyFilteredQueryBuilder } = require("../helpers/filteredQueryBuilder");


class Company {

  static async filteredCompanies(query) {
    let finalQuery = companyFilteredQueryBuilder(query);

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
      `SELECT c.handle, c.name, c.num_employees, c.description, c.logo_url, j.title
      FROM companies AS c
      INNER JOIN jobs AS j
      ON c.handle = j.company_handle
      WHERE handle=$1`,
      [handle]
    )

    if (!result.rows[0]) {
      throw new ExpressError("Company not found!");
    }
    
    let { name, num_employees, description, logo_url } = result.rows[0];
    let jobs = result.rows.map(j => j.title);
    let companyObj = {company: {handle, name, num_employees, description, logo_url, jobs}};
    return companyObj;
  }

  static async patch(items, handle) {
    let update = sqlForPartialUpdate("companies", items, "handle", handle);

    const result = await db.query(
      `${update.query}`,
      update.values
    );
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
      [handle]);

    if (result.rows[0].length === 0) {
      throw new ExpressError("No such company", 404);
    }

    let deleted = "Company deleted";
    return deleted;
  }
}

module.exports = Company;