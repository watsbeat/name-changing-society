DROP TABLE IF EXISTS names;
CREATE TABLE names (
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL references users(id),
    -- or NUMERIC
    full_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL
);