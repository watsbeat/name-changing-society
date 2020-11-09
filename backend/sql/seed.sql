/**
 * Seeding the database this way won't work properly since the passwords don't get hashed
 * TODO: Implement a better way of seeding
 */

BEGIN;

INSERT INTO users (user_id, username, email, password)
VALUES
    (1, 'user1', 'user1@hello.com', 'password'),
    (2, 'user2', 'user2@hello.com', 'password'),
    (3, 'user3', 'user3@hello.com', 'password'),
    (4, 'user4', 'user4@hello.com', 'password');

-- Create citizens who are users
INSERT INTO citizens (citizen_id, user_id)
VALUES
    (1, 1), (2, 2), (3, 3), (4, 4);
    
-- Create citizens who aren't users
INSERT INTO citizens (citizen_id)
VALUES
    (5), (6), (7), (8), (9), (10), (11), (12), (13), (14), (15), (16);

-- Seed names table
INSERT INTO names
    (first_name, middle_name, last_name, held_from, held_to, citizen_id)
VALUES 
-- Current and historical names for citizen 1
    ('Simon', 'Red', 'Potter', '2019-10-06'::date, 'Infinity', 1),
    ('Luna', 'Pink', 'Lovegood', '2019-02-03'::date, '2019-10-05', 1),
    ('Fox', 'Orange', 'Forest', '2019-01-03'::date, '2019-02-02', 1),
    ('Declan', 'Poker', 'Ledger', '2018-08-08'::date, '2019-01-02', 1),
    ('June', 'Calendar', 'Kennedy', '2018-06-05'::date, '2018-08-07', 1),
    ('Penny', 'Indigo', 'Smithy', '2017-12-12'::date, '2018-06-04', 1),
    ('Lou', 'Drums', 'Burton', '2017-05-16'::date, '2017-12-11', 1),
    ('August', 'Arnold', 'Artichoke', '2017-02-09'::date, '2017-05-15', 1),
-- Current and historical names for citizen 2
    ('Ron', 'Yellow', 'Weasley', '2019-11-06'::date, 'Infinity', 2),
    ('Anne', 'Violet', 'Seymour', '2018-10-05'::date, '2019-10-05', 2),
-- Current and historical names for citizen 3
    ('Hermione', 'Green', 'Granger', '2019-11-06'::date, 'Infinity', 3),
    ('Jane', 'Magenta', 'Austen', '2018-10-05'::date, '2019-10-05', 3),
-- Current and historical names for citizen 4
    ('Neville', 'Blue', 'Longbottom', '2019-11-06'::date, 'Infinity', 4),
    ('Neal', 'Navy', 'Stephenson', '2018-10-05'::date, '2019-10-05', 4),
-- Other citizens current names within 28 days from being a year old
    ('Isaac', 'Robots', 'Asimov', '2019-11-17'::date, 'Infinity', 5),
    ('Ned', 'Bushranger', 'Kelly', '2019-11-18'::date, 'Infinity', 6),
    ('John', 'Poet', 'Keats', '2019-11-19'::date, 'Infinity', 7),
    ('Thomas', 'Lightbulb', 'Edison', '2019-11-20'::date, 'Infinity', 8),
    ('Henry', 'Pen', 'James', '2019-11-20'::date, 'Infinity', 9),
    ('Ruby', 'Gem', 'Scarlet', '2019-11-21'::date, 'Infinity', 10),
    ('Salman', 'Stars', 'Rushdie', '2019-11-22'::date, 'Infinity', 11),
    ('Aquarius', 'Water', 'Bearer', '2019-11-23'::date, 'Infinity', 12),
    ('Dragon', 'Dream', 'Zodiac', '2019-11-24'::date, 'Infinity', 13),
    ('Percy', 'Ode', 'Shelley', '2019-11-25'::date, 'Infinity', 14),
    ('Murray', 'Murky', 'River', '2019-11-26'::date, 'Infinity', 15),
    ('Silent', 'Quiet', 'Ssh', '2019-11-27'::date, 'Infinity', 16);

-- Store highest user id sequence 
SELECT SETVAL('users_sequence', (SELECT MAX(user_id) FROM users)::BIGINT);

-- Store highest user id sequence 
SELECT SETVAL('citizens_sequence', (SELECT MAX(citizen_id) FROM citizens)::BIGINT);

COMMIT;