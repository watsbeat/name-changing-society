DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    citizen_id int NOT NULL references citizens(id)
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    email VARCHAR(255) UNIQUE NOT NULL,
);