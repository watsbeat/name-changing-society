BEGIN;

-- Store highest user id sequence 
DROP SEQUENCE IF EXISTS users_sequence;
CREATE SEQUENCE users_sequence;
SELECT SETVAL('users_sequence', (SELECT MAX(user_id) FROM users)::BIGINT);

-- Store highest citizen id sequence 
DROP SEQUENCE IF EXISTS citizens_sequence;
CREATE SEQUENCE citizens_sequence;
SELECT SETVAL('citizens_sequence', (SELECT MAX(citizen_id) FROM citizens)::BIGINT);

-- Create session table per https://github.com/voxpelli/node-connect-pg-simple
DROP TABLE IF EXISTS session;
CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Create users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id NUMERIC NOT NULL, -- foreign key?
    username VARCHAR(255) UNIQUE NOT NULL, -- primary key
    password VARCHAR(255) NOT NULL,
    email TEXT UNIQUE NOT NULL -- primary key?
);

CREATE UNIQUE INDEX users_unique
ON users USING BTREE (user_id, username, email);

-- Create citizens table
DROP TABLE IF EXISTS citizens CASCADE;
CREATE TABLE citizens (
    citizen_id SERIAL PRIMARY KEY,
    user_id NUMERIC --references users(user_id)-- foreign key?
);

-- Create names table
DROP TABLE IF EXISTS names CASCADE;
CREATE TABLE names (
    citizen_id int NOT NULL references citizens(citizen_id), -- key
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR,
    last_name VARCHAR NOT NULL,
    held_from DATE NOT NULL,
    held_to DATE NOT NULL
);

COMMIT;