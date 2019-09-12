process.env.NODE_ENV = "test";
const db = require("../../db");
const request = require("supertest");
const app = require("../../app");
const Job = require("../../models/jobsModel");
const Company = require("../../models/companiesModel");
let job1;


describe("JOB ROUTE TESTS", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");

    let company1 = await Company.create({
      handle: "rithm",
      name: "Rithm",
      num_employees: 10,
      description: "school",
      logo_url: null
    });

    job1 = await Job.create({
      title: "Software Engineer - TEST",
      salary: 100000,
      equity: 0.05,
      company_handle: "rithm"
    });

    let job2 = await Job.create({
      title: "Genius - TEST",
      salary: 600000,
      equity: 0.05,
      company_handle: "rithm"
    });
  });

  describe("POST /jobs", function () {
    test("should add a new job",
      async function () {
        let result = await request(app).post(`/jobs`)
          .send({
            title: "Software Engineer - TEST2",
            salary: 100000,
            equity: 0.05,
            company_handle: "rithm"
          });

        expect(result.body).toEqual({
          job: {
            title: "Software Engineer - TEST2",
            salary: 100000,
            equity: 0.05,
            company_handle: "rithm",
            date_posted: expect.any(String),
            id: expect.any(Number)
          }
        })
        expect(result.statusCode).toEqual(201);
        const allJobs = await request(app).get(`/jobs`);
        expect(allJobs.body.jobs).toHaveLength(3);
      })
  })

  describe("GET /jobs", function () {
    test("should return a filtered list of jobs based on search of ENG",
      async function () {
        let result = await request(app).get(`/jobs?search=ENG`);

        expect(result.body).toEqual({
          jobs: [
            {
              title: "Software Engineer - TEST",
              company_handle: "rithm"
            }
          ]
        });
        expect(result.statusCode).toEqual(200);
      });

    test("should return a filtered list of jobs based on search of min_equity",
      async function () {
        let result = await request(app).get(`/jobs?min_equity=.05`);

        expect(result.body).toEqual({
          jobs: [
            {
              title: "Software Engineer - TEST",
              company_handle: "rithm"
            },
            {
              title: "Genius - TEST",
              company_handle: "rithm"
            }
          ]
        });
        expect(result.statusCode).toEqual(200);
      });

    test("should return an error for negative min_salary",
      async function () {
        let result = await request(app).get(`/jobs?min_salary=-10`);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual({
          status: 400,
          message: "Minimum salary can't be negative"
        });
      });
  });

  describe("/GET /jobs/[id]", function () {
    test("should return 1 job based on id",
      async function () {
        let result = await request(app).get(`/jobs/${job1.id}`);

        expect(result.body).toEqual({
          job: {
            title: "Software Engineer - TEST",
            salary: 100000,
            equity: 0.05,
            company_handle: "rithm",
            date_posted: expect.any(String)
          }
        });
        expect(result.statusCode).toEqual(200);
      });

    test("should return an error for a job that doesn't exist",
      async function () {
        let result = await request(app).get(`/jobs/0`);

        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({
          status: 404,
          message: "That job does not exist!"
        });
      });
  });

  describe("/PATCH /jobs/[id]", function () {
    test("should return updated job",
      async function () {
        let result = await request(app)
          .patch(`/jobs/${job1.id}`)
          .send({
            items: { title: "New grad engineer" }
          });

        expect(result.body).toEqual({
          job: {
            id: expect.any(Number),
            title: "New grad engineer",
            salary: 100000,
            equity: 0.05,
            company_handle: "rithm",
            date_posted: expect.any(String)
          }
        });
        expect(result.statusCode).toEqual(200);
      });

    test("should return an error for a job that doesn't exist",
      async function () {
        let result = await request(app).patch(`/jobs/0`)
          .send({
            items: { title: "New grad engineer" }
          });

        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({
          status: 404,
          message: "Job not found!"
        });
      });
  });

  describe("/DELETE /jobs/[id]", function () {
    test("should delete specified job",
      async function () {
        let result = await request(app)
          .delete(`/jobs/${job1.id}`)

        expect(result.body).toEqual({ message: "Job deleted" })
        const allJobs = await request(app).get(`/jobs`);
        expect(allJobs.body.jobs).toHaveLength(1);
        expect(result.statusCode).toEqual(200);
      });

    test("should return an error for a job that doesn't exist",
      async function () {
        let result = await request(app).delete(`/jobs/0`);

        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({
          status: 404,
          message: "No such job"
        });
      });
  });

  afterAll(async function () {
    await db.end();
  });
});

