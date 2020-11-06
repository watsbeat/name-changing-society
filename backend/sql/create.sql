BEGIN;
DROP TABLE IF EXISTS citizens CASCADE;
CREATE TABLE citizens (
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL references users(id)
);
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    citizen_id int NOT NULL references citizens(id),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);
DROP TABLE IF EXISTS names CASCADE;
CREATE TABLE names (
    id SERIAL PRIMARY KEY,
    citizen_id int NOT NULL references citizens(id),
    user_id int references users(id),
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR,
    last_name VARCHAR NOT NULL,
    held_from DATE NOT NULL,
    held_to DATE NOT NULL
);
COMMIT;