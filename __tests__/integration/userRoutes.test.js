process.env.NODE_ENV = "test";
const db = require("../../db");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/usersModel");
let user1;

describe("USER ROUTE TESTS", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM users");

    user1 = await User.create({
      username: "garfield",
      password: "password",
      first_name: "cat",
      last_name: "kitty",
      email: "garfield@cat.com",
      photo_url: ""
    });

    let user2 = await User.create({
      username: "clifford",
      password: "password",
      first_name: "big",
      last_name: "red",
      email: "red@dog.com",
      photo_url: ""
    });
  });

  describe("POST /users", function () {
    test("should add a new user",
      async function () {
        let result = await request(app)
          .post(`/users`)
          .send({
            username: "bluesclues",
            password: "password",
            first_name: "doggggerr",
            last_name: "blue",
            email: "bc@cat.com",
            photo_url: "",
            is_admin: false
          });

        expect(result.body).toEqual({
          user: {
            username: "bluesclues",
            first_name: "doggggerr",
            last_name: "blue",
            email: "bc@cat.com",
            photo_url: "",
            is_admin: false
          }
        })
        expect(result.statusCode).toEqual(201);
        const allUsers = await request(app).get(`/users`);
        expect(allUsers.body.users).toHaveLength(3);
      })
  })

  describe("GET /users", function () {
    test("should return a list of users",
      async function () {
        let result = await request(app).get(`/users`);

        expect(result.body).toEqual({
          "users": [
            {
              username: "garfield",
              first_name: "cat",
              last_name: "kitty",
              email: "garfield@cat.com",
            },
            {
              username: "clifford",
              first_name: "big",
              last_name: "red",
              email: "red@dog.com",
            }
          ]
        });
        expect(result.statusCode).toEqual(200);
      });
  });

  describe("GET /users/:username", function () {
    test("should return a specific user",
      async function () {
        let result = await request(app).get(`/users/${user1.username}`);

        expect(result.body).toEqual({
          user: {
            username: "garfield",
            first_name: "cat",
            last_name: "kitty",
            email: "garfield@cat.com",
            photo_url: ""
          }
        });
        expect(result.statusCode).toEqual(200);
      });

    test("should return an error for a user that doesn't exist",
      async function () {
        let result = await request(app).get(`/users/0`);

        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({
          status: 404,
          message: "That user does not exist!"
        });
      });
  });

  describe("/PATCH /users/:username", function () {
    test("should return updated user",
      async function () {
        let result = await request(app)
          .patch(`/users/${user1.username}`)
          .send({
            items: { first_name: "orange" }
          });

        expect(result.body).toEqual({
          user: {
            username: "garfield",
            first_name: "orange",
            last_name: "kitty",
            email: "garfield@cat.com",
            photo_url: "",
            is_admin: expect.any(Boolean)
          }
        });
        expect(result.statusCode).toEqual(200);
      });

    test("should return an error for a user that doesn't exist",
      async function () {
        let result = await request(app).patch(`/users/0`)
          .send({
            items: { first_name: "orange" }
          });

        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({
          status: 404,
          message: "User not found!"
        });
      });
  });

  describe("/DELETE /users/[id]", function () {
    test("should delete specified user",
      async function () {
        let result = await request(app)
          .delete(`/users/${user1.username}`)

        expect(result.body).toEqual({ message: "User deleted" })
        const allUsers = await request(app).get(`/users`);
        expect(allUsers.body.users).toHaveLength(1);
        expect(result.statusCode).toEqual(200);
      });

    test("should return an error for a user that doesn't exist",
      async function () {
        let result = await request(app).delete(`/users/0`);

        expect(result.statusCode).toEqual(404);
        expect(result.body).toEqual({
          status: 404,
          message: "No such username"
        });
      });
  });

  afterAll(async function () {
    await db.end();
  });
});
