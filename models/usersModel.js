const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const bcrypt = require("bcrypt")
const {
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  DB_URI
} = require("../config");

class User {
  static async all() {
    const result = await db.query(
      `SELECT username, first_name, last_name, email
      FROM users`
    );

    let users = result.rows;

    return users;
  }

  static async create({ username, password, first_name, last_name, email, photo_url, is_admin=false }) {
    const hashedPw = await bcrypt.hash(
      password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (
        username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING username, first_name, last_name, email, photo_url, is_admin`,
      [username, hashedPw, first_name, last_name, email, photo_url, is_admin]
    );

    let user = result.rows[0];
    return user;
  }

  static async getByUsername(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, photo_url
      FROM users
      WHERE username=$1`,
      [username]
    );

    if (!result.rows[0]) {
      throw new ExpressError("That user does not exist!", 404);
    }

    let user = result.rows[0];
    return user;
  }

  static async patch(items, username) {
    let update = sqlForPartialUpdate("users", items, "username", username);
    const result = await db.query(
      update.query,
      update.values
    );

    if (!result.rows[0]) {
      throw new ExpressError("User not found!", 404);
    }

    let updatedUser = result.rows[0];
    delete updatedUser.password;
    return updatedUser;
  }

  static async delete(username) {
    const result = await db.query(
      `DELETE
      FROM users 
      WHERE username=$1
      RETURNING username`,
      [username]);

    if (!result.rows[0]) {
      throw new ExpressError("No such username", 404);
    }

    let deleted = "User deleted";
    return deleted;
  }

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]);
      const user = result.rows[0];
      return user && await bcrypt.compare(password, user.password);
  }
}


module.exports = User;