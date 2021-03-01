// database configurations

// create database connection between express application and postgres database
const pgp = require("pg-promise")(); // require the package and immediately call the package
const connection =
  "postgres://postgres:hello@localhost:5432/postgres";
const db = pgp(connection);

// export to let other files access the database
module.exports = db;
