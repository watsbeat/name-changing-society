BEGIN;

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

-- Create citizens table
DROP TABLE IF EXISTS citizens CASCADE;
CREATE TABLE citizens (
    id SERIAL PRIMARY KEY,
    user_id int references users(id)
);

-- Create users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    citizen_id int UNIQUE references citizens(id), -- should be NOT NULL, but causes issues at signup
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Create names table
DROP TABLE IF EXISTS names CASCADE;
CREATE TABLE names (
    id SERIAL PRIMARY KEY,
    citizen_id int NOT NULL references citizens(id),
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR,
    last_name VARCHAR NOT NULL,
    held_from DATE NOT NULL,
    held_to DATE NOT NULL
);

COMMIT;