// database configurations

// create database connection between express application and postgres database
const pgp = require("pg-promise")(); // require the package and immediately call the package
const connection =
  "postgres://postgres:1102448095@localhost:5432/mr_coffee_project4";
const db = pgp(connection);

// export to let other files access the database
module.exports = db;
