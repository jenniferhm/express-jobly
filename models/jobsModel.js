const db = require("../db");
const ExpressError = require("../helpers/expressError");
const { jobFilteredQueryBuilder } = require("../helpers/filteredQueryBuilder");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


class Job {
  static async filteredJobs(query) {
    let finalQuery = jobFilteredQueryBuilder(query);

    const result = await db.query(
      `${finalQuery.baseQuery}`, finalQuery.queryValues
    );

    let jobs = result.rows;

    return jobs;
  }

  static async create({ title, salary, equity, company_handle }) {
    const result = await db.query(
      `INSERT INTO jobs (
        title,
        salary,
        equity,
        company_handle,
        date_posted)
        VALUES ($1, $2, $3, $4, current_timestamp)
        RETURNING title, salary, equity, company_handle, date_posted`,
      [title, salary, equity, company_handle]
    );

    let job = result.rows[0];
    return job;
  }
  
  static async getById(id) {
    const result = await db.query(
      `SELECT title, salary, equity, company_handle, date_posted
      FROM jobs
      WHERE id=$1`,
      [id]
    )

    if (!result.rows[0]) {
      throw new ExpressError("That job does not exist!");
    }

    let job = result.rows[0];
    return job;
  }

  static async patch(items, id) {
    let update = sqlForPartialUpdate("jobs", items, "id", id)

    const result = await db.query(
      `${update.query}`,
      update.values
    )

    if (!result.rows[0]) {
      throw new ExpressError("Job not found!", 404);
    }

    let updatedJob = result.rows[0];
    return updatedJob;

  }

  static async delete(id) {
    const result = await db.query(
    `DELETE
    FROM jobs 
    WHERE id=$1
    RETURNING id`,
      [id])

    if (!result.rows[0]) {
      throw new ExpressError("No such job", 404);
    }

    let deleted = "Job deleted";
    return deleted;
  }
}

module.exports = Job;