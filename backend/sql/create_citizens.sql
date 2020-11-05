DROP TABLE IF EXISTS citizens;
CREATE TABLE citizens (
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL references users(id)
);