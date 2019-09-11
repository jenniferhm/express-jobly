process.env.NODE_ENV = "test";
// const app = require("..../app");
const db = require("../../db");

const sqlForPartialUpdate = require("../../helpers/partialUpdate");

describe("OUTSIDE", function() {
  beforeEach(async function() {
    await db.query("DELETE FROM companies");

    let company1 = await db.query(
      `INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING handle, name, num_employees, description, logo_url`,
        ['apple', 'Apple', '50000', 'A fruit.', 'https://image.flaticon.com/icons/png/512/23/23656.png' ]
    );
  })


  describe("partialUpdate()", () => {
    it("should generate a proper partial update query with just 1 field",
        function () {
      let result = sqlForPartialUpdate("companies", {"num_employees": 50}, "apple", 1);
      
      expect(result.query).toEqual(`UPDATE companies SET num_employees=$1 WHERE apple=$2 RETURNING *`);
    });
  });


  afterAll(async function () {
    await db.end();
  });
})

