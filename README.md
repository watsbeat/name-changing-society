# Name Changing Society

**PERN stack:** [PostgreSQL](https://www.postgresql.org), [Express](https://expressjs.com), [React](https://reactjs.org) & [Node](https://nodejs.org/en/).

**Deloyed Client App:** <https://awesome-borg-a5a854.netlify.app>

**Deployed API:** <https://name-changing-society.herokuapp.com> (with Heroku Postgres DB attached)

*Note:* The deployed client and server apps are not totally working yet, run locally for best results 🤓

Some key dependencies:

- [pg-promise](https://github.com/vitaly-t/pg-promise): Promise library for postgresql
- [axios](https://github.com/axios/axios): Promise-based HTTP client for the browser and node.js
- [Material-UI](https://material-ui.com): React component library implementing Material Design
- [React Router](https://github.com/ReactTraining/react-router#readme): Dynamic routing for React

## Setup Instructions

----

Clone repo to your local machine: `git clone https://github.com/watsbeat/name-changing-society`

### Backend

- Change into backend directory: `cd name-changing-society/backend`
- Install & use the correct node version: `nvm install` and `nvm use` (v14)
- Install npm packages: `npm i`
- Launch the server: `npm start`
- Go to `http://localhost:8091/v1` in your browser or test in Postman (import `openapi.yml`)

#### Environment Variables

Add these secrets to a dotenv file:

```env
PORT=8091
PGDATABASE=<database>
PGUSER=<user>
PGPASSWORD=<password>
PGHOST=<host>
PGPORT=<port>
SESSION_SECRET=<some_gibberish>
```

#### Database

Make sure you have postgresql install and start, e.g. `brew install postgres` and `brew services start postgres`.

```bash
createdb <database> # create database
psql -d <database> # login

# Setup database schema (or run in a GUI like pgAdmin):
psql <database> < node_modules/connect-pg-simple/table.sql
psql -d <databas> < sql/create_users.sql
psql -d <database> < sql/create_names.sql
psql -d <database> < sql/create_citizens.sql
```

## Frontend

In a new terminal:

- Change into frontend directory: `cd name-changing-society/backend`
- Install & use the correct node version: `nvm install` and `nvm use` (v14)
- Install npm packages: `npm i`
- Launch the client app: `npm start`
- Go to `http://localhost:3000/`

## API Endpoints

----

1. POST `v1/auth/register` - Create new user, if not already logged in.
2. POST `v1/auth/login` - Log user in, if not already logged in.
3. GET `v1/auth/logout` - Log user out, if not already logged out.

4. GET `v1/names` - Get list of names available within the next 28 days (unauthenticated access allowed).

5. GET `v1/users/:id` - Get user's current name.
6. POST `v1/users/:id` - Create a new name for user that they haven't held in the past, and no other citizen currently holds.
7. GET `v1/users/:user_id/history` - Get user's historical names, including their current one (for a comprehesive history).

## Considerations

----

### Future Features

**Scenario:** A users can submit a new name that will come into effect within 28 days.

- Send a held_from future date with the request
- Write SQL to check that no other citizens are associated with a name for that held_from date (whoever "schedules" that name first, gets to have it at that date).
- "Close" the held_to date of the user's previous name (usually the current one) by setting it to one day before the held_from date of the new future/"scheduled" name.
- The current name should always be held_to infinity, until an update/new name "closes" it.
- No name entries for a given user should ever have overlapping dates, it should follow a zig-zag pattern as shown below.

**Example:**

If the current date is 2019-11-01, the current name is Name2 and the future/"scheduled" name is Name3. Name3 will come into effect from 2019-12-15, until it gets "closed" by the user submitting a subsequent name change.

name  | held_from  | held_to
------|------------|----------
Name3 | 2019-12-15 | infinity ("open"/current name)
Name2 | 2019-10-11 | 2020-12-14 ("closed", held for a couple months)
Name1 | 2019-10-10 | 2020-10-10 ("closed", held for a year)

**Scenario:** Citizens must change their name every 12 months. A report must be created and submitted every day to the World Name Society, so that they can chase up citizens with expiring names.

Write SQL to retrieve the users that have names more than 1 year old, "expiring" names. Then, either:

- Write a CRON job that will send a daily email to World Name Society.
- Make a public API endpoint that the World Name Society can use as they please to retrieve the list directly from us.
- Extend the frontend app to allow World Name Society members (create new role, different from citizen users) to login and audit the expiring names through our interface, e.g. they can mark citizens as "followed up on" or "outstanding".

----

## Screenshots During Dev Phase

![Login Page Screenshot](assets/login.png#thumbnail)

![Dashboard Tablet Screenshot](assets/dashboard-tablet.png#thumbnail)
