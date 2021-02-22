# Mr.Coffee Schedule App with Authentication

## Description

This is an internal web application for managing user schedules of Mr.Coffee's employees. The app will display all existing user's schedules and users will be able to add their own schedules and view other users' schedules. This is a second version of the application with user authentication added to provide privacy of data.

## Database Setup

### Create Database

CREATE DATABASE mr_coffee_project4;

### Create Tables

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schedules;

CREATE TABLE IF NOT EXISTS users (
user_id serial primary key,
surname varchar(50) not null,
firstname varchar(50) not null,
email varchar(50) not null,
password char(64) not null
);

CREATE TABLE IF NOT EXISTS schedules (
schedule_id serial primary key,
user_id int REFERENCES users(user_id),
day int not null,
start_time timestamp not null,
end_time timestamp not null
);

### Seed Users Table

INSERT INTO users(surname, firstname, email, password)
VALUES ('Bond', 'James', 'james.bond@gmail.com', '8b5d7649d443334e3a9b1dd80704d4838db6578ace1d3d72cd0541dd289ee069');

INSERT INTO users(surname, firstname, email, password)
VALUES ('Stark', 'Tony', 'starkrulz@gmail.com', '961333c60f92024b437864eb6973cb24f4313365f60588b7692fb50b36b8545e');

INSERT INTO users(surname, firstname, email, password)
VALUES ('G', 'Ali', 'nameisnotborat@gmail.com', 'fd8b6cf243e9b365e18a86ccaf351eb46e45ff01c12ba51ddd4493d49380ab60');

### Seed Schedules Table

INSERT INTO schedules(user_id, day, start_time, end_time)
VALUES (1, 3, '2021-03-24 10:30:00', '2021-03-24 12:00:00');

INSERT INTO schedules(user_id, day, start_time, end_time)
VALUES (1, 5, '2021-03-26 16:20:00', '2021-03-26 18:30:00');

INSERT INTO schedules(user_id, day, start_time, end_time)
VALUES (2, 1, '2021-02-22 10:00:00', '2021-02-22 13:50:00');

INSERT INTO schedules(user_id, day, start_time, end_time)
VALUES (2, 4, '2021-03-04 13:00:00', '2021-03-04 14:30:00');

INSERT INTO schedules(user_id, day, start_time, end_time)
VALUES (3, 6, '2021-03-20 08:00:00', '2021-03-20 11:30:00');

INSERT INTO schedules(user_id, day, start_time, end_time)
VALUES (3, 7, '2021-03-28 21:00:00', '2021-03-28 23:30:00');

## License

[MIT](https://choosealicense.com/licenses/mit/)
