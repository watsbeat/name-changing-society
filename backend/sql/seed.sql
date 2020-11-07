/**
 * Seeding the database this way won't work properly since the passwords don't get hashed
 * TODO: Implement a better way of seeding
 */

BEGIN;

-- Create citizens
INSERT INTO citizens (user_id)
VALUES
    (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11), (12), (13), (14), (15), (16);

-- Create users (link to citizens)
INSERT INTO users (citizen_id, username, email, password)
VALUES
-- Passwords need to be hashed
    (1, 'user1', 'citizen1@email.com', 'password'),
    (2, 'user2', 'citizen2@email.com', 'password'),
    (3, 'user3', 'citizen3@email.com', 'password'),
    (4, 'user4', 'citizen4@email.com', 'password'),
    (5, 'user5', 'citizen5@email.com', 'password'),
    (6, 'user6', 'citizen6@email.com', 'password'),
    (7, 'user7', 'citizen7@email.com', 'password'),
    (8, 'user8', 'citizen8@email.com', 'password'),
    (9, 'user9', 'citizen9@email.com', 'password'),
    (10, 'user10', 'citizen10@email.com', 'password'),
    (11, 'user11', 'citizen11@email.com', 'password'),
    (12, 'user12', 'citizen12@email.com', 'password'),
    (13, 'user13', 'citizen13@email.com', 'password'),
    (14, 'user14', 'citizen14@email.com', 'password'),
    (15, 'user15', 'citizen15@email.com', 'password'),
    (16, 'user16', 'citizen16@email.com', 'password');

-- Seed names table
INSERT INTO names
    (first_name, middle_name, last_name, held_from, held_to, citizen_id, user_id)
VALUES 
-- Current and historical names for citizen 1
    ('Simon', 'Red', 'Potter', '2019-10-06'::date, 'Infinity', 1, 1),
    ('Luna', 'Pink', 'Lovegood', '2019-02-03'::date, '2019-10-05', 1, 1),
    ('Fox', 'Orange', 'Forest', '2019-01-03'::date, '2019-02-02', 1, 1),
    ('Declan', 'Poker', 'Ledger', '2018-08-08'::date, '2019-01-02', 1, 1),
    ('June', 'Calendar', 'Kennedy', '2018-06-05'::date, '2018-08-07', 1, 1),
    ('Penny', 'Indigo', 'Smithy', '2017-12-12'::date, '2018-06-04', 1, 1),
    ('Lou', 'Drums', 'Burton', '2017-05-16'::date, '2017-12-11', 1, 1),
    ('August', 'Arnold', 'Artichoke', '2017-02-09'::date, '2017-05-15', 1, 1),
-- Current and historical names for citizen 2
    ('Ron', 'Yellow', 'Weasley', '2019-11-06'::date, 'Infinity', 2, 2),
    ('Anne', 'Violet', 'Seymour', '2018-10-05'::date, '2019-10-05', 2, 2),
-- Current and historical names for citizen 3
    ('Hermione', 'Green', 'Granger', '2019-11-06'::date, 'Infinity', 3, 3),
    ('Jane', 'Magenta', 'Austen', '2018-10-05'::date, '2019-10-05', 3, 3),
-- Current and historical names for citizen 4
    ('Neville', 'Blue', 'Longbottom', '2019-11-06'::date, 'Infinity', 4, 4),
    ('Neal', 'Navy', 'Stephenson', '2018-10-05'::date, '2019-10-05', 4, 4),
-- Other citizens current names within 28 days from being a year old
    ('Isaac', 'Robots', 'Asimov', '2019-11-17'::date, 'Infinity', 5, 5),
    ('Ned', 'Bushranger', 'Kelly', '2019-11-18'::date, 'Infinity', 6, 6),
    ('John', 'Poet', 'Keats', '2019-11-19'::date, 'Infinity', 7, 7),
    ('Thomas', 'Lightbulb', 'Edison', '2019-11-20'::date, 'Infinity', 8, 8),
    ('Henry', 'Pen', 'James', '2019-11-20'::date, 'Infinity', 9, 9),
    ('Ruby', 'Gem', 'Scarlet', '2019-11-21'::date, 'Infinity', 10, 10),
    ('Salman', 'Stars', 'Rushdie', '2019-11-22'::date, 'Infinity', 11, 11),
    ('Aquarius', 'Water', 'Bearer', '2019-11-23'::date, 'Infinity', 12, 12),
    ('Dragon', 'Dream', 'Zodiac', '2019-11-24'::date, 'Infinity', 13, 13),
    ('Percy', 'Ode', 'Shelley', '2019-11-25'::date, 'Infinity', 14, 14),
    ('Murray', 'Murky', 'River', '2019-11-26'::date, 'Infinity', 15, 15),
    ('Silent', 'Quiet', 'Ssh', '2019-11-27'::date, 'Infinity', 16, 16);

COMMIT;