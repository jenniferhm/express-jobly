process.env.NODE_ENV = "test";
const db = require("../../db");

const request = require("supertest");
const app = require("../../app")
const Company = require("../../models/companiesModel")
let company1;


describe("OUTSIDE", function () {
  beforeEach(async function () {
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
  })


  describe("GET /companies", function () {
    test("should return a filtered list of companies based on query string",
      async function () {
        let result = await request(app).get(`/companies/?search=apple`);

        expect(result.body).toEqual({
          "companies": [
            {
              "handle": "apple",
              "name": "Apple"
            }
          ]
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
          })

        expect(result.body).toEqual({
          company: {
            "handle": "rithm",
            "name": "Rithm",
            "num_employees": 10,
            "description": "red",
            "logo_url": null
          }
        })
        expect(result.statusCode).toEqual(201);

        const allCompanies = await request(app).get(`/companies`);
        expect(allCompanies.body.companies).toHaveLength(3);
      })
  })

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
            "logo_url": null
          }
        });
        expect(result.statusCode).toEqual(200);
      })
  })

  describe("PATCH /companies/[handle]", function () {
    test("should return updated company",
      async function () {
        let result = await request(app)
          .put(`/companies/${company1.handle}`)
          .send({{"num_employees": 50}, "apple", 1});

        expect(result.body).toEqual({
          "company": {
            "handle": "apple",
            "name": "Apple",
            "num_employees": 4000,
            "description": "fruit",
            "logo_url": null
          }
        });
      })
  })





  afterAll(async function () {
    await db.end();
  });
})

