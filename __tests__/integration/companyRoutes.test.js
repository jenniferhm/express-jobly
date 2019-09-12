process.env.NODE_ENV = "test";
const db = require("../../db");

const request = require("supertest");
const app = require("../../app");
const Company = require("../../models/companiesModel");
const Job = require("../../models/jobsModel");
let company1;


describe("COMPANY ROUTE TESTS", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");

    company1 = await Company.create({
      "handle": "apple",
      "name": "Apple",
      "num_employees": 500,
      "description": "fruit",
      "logo_url": null
    });
    let company2 = await Company.create({
      "handle": "ibm",
      "name": "IBM",
      "num_employees": 600,
      "description": "blue",
      "logo_url": null
    });

    let job1 = await Job.create({
      "title": "Software Engineer - TEST",
      "salary": 100000,
      "equity": 0.05,
      "company_handle": "apple"
    });
  })


  describe("GET /companies", function () {
    test("should return a filtered list of companies based on search of 'App'",
      async function () {
        let result = await request(app).get(`/companies?search=App`);

        expect(result.body).toEqual({
          "companies": [
            {
              "handle": "apple",
              "name": "Apple"
            }
          ]
        });
      });

    test("return a filtered list of companies that have min_employees of 100 and max_employees of 700",
      async function () {
        let result = await request(app).get(`/companies?min_employees=100&max_employees=700`);

        expect(result.body).toEqual({
          "companies": [
            {
              "handle": "apple",
              "name": "Apple",
            },
            {
              "handle": "ibm",
              "name": "IBM",
            }
          ]
        });
      });

    test("return a 400 because max_employees exceeds min_employees",
      async function () {
        let result = await request(app).get(`/companies?min_employees=1000&max_employees=10`);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual({
          "status": 400,
          "message": "Minimum number of employees is greater than maximum number of employees!"
        });
      });
  });

  describe("POST /companies", function () {
    test("should return the added company",
      async function () {
        let result = await request(app)
          .post(`/companies`)
          .send({
            "handle": "rithm",
            "name": "Rithm",
            "num_employees": 10,
            "description": "red",
            "logo_url": null
          });

        expect(result.body).toEqual({
          company: {
            "handle": "rithm",
            "name": "Rithm",
            "num_employees": 10,
            "description": "red",
            "logo_url": null
          }
        });
        expect(result.statusCode).toEqual(201);

        const allCompanies = await request(app).get(`/companies`);
        expect(allCompanies.body.companies).toHaveLength(3);
      });
  });

  describe("GET /companies/[handle]", function () {
    test("should return 1 company",
      async function () {
        let result = await request(app).get(`/companies/${company1.handle}`);

        expect(result.body).toEqual({
          "company": {
            "handle": "apple",
            "name": "Apple",
            "num_employees": 500,
            "description": "fruit",
            "logo_url": null,
            "jobs": [
              "Software Engineer - TEST"
            ]
          }
        });
        expect(result.statusCode).toEqual(200);
      });
  });

  describe("PATCH /companies/[handle]", function () {
    test("should return updated company",
      async function () {
        let result = await request(app)
          .patch(`/companies/${company1.handle}`)
          .send({
            "items": { "num_employees": 500 }
          });

        expect(result.body).toEqual({
          "company": {
            "handle": "apple",
            "name": "Apple",
            "num_employees": 500,
            "description": "fruit",
            "logo_url": null
          }
        });
      });
  });

  describe("DELETE /companies/[handle]", function () {
    test("should delete specified company",
      async function () {
        let result = await request(app)
          .delete(`/companies/${company1.handle}`);

        expect(result.body).toEqual({ message: "Company deleted" });
        const allCompanies = await request(app).get(`/companies`);
        expect(allCompanies.body.companies).toHaveLength(1);
      });
  });

  afterAll(async function () {
    await db.end();
  });
});

