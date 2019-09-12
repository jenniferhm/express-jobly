process.env.NODE_ENV = "test";
const db = require("../../db");

const request = require("supertest");
const app = require("../../app")
const Job = require("../../models/jobsModel")
const Company = require("../../models/companiesModel")
let job1;


describe("JOB ROUTE TESTS", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM jobs");

    let company1 = await Company.create({
      "handle": "rithm",
      "name": "Rithm",
      "num_employees": 10,
      "description": "school",
      "logo_url": null
    });

    job1 = await Job.create({
      "title": "Software Engineer - TEST",
      "salary": 100000,
      "equity": 0.05,
      "company_handle": "apple"
    });
    console.log("THIS IS JOB1:", job1);
    let job2 = await Job.create({
      "title": "Genius - TEST",
      "salary": 600000,
      "equity": 0.05,
      "company_handle": "apple"
    });
  })

  describe("GET /jobs", function () {
    test("should return a filtered list of jobs based on search of ENG",
      async function () {
        let result = await request(app).get(`/jobs?search=ENG`);

        expect(result.body).toEqual({
          "jobs": [
            {
              "title": "Software Engineer - TEST",
              "company_handle": "apple"
            }
          ]
        })
      });
  });



    afterAll(async function () {
      await db.end();
    });
  })

