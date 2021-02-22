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