DROP TABLE IF EXISTS names;
CREATE TABLE names (
    id SERIAL PRIMARY KEY,
    citizen_id int NOT NULL references citizens(id),
    user_id int NOT NULL references users(id),
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR,
    last_name VARCHAR NOT NULL
    held_from DATE NOT NULL,
    held_to DATE NOT NULL
);