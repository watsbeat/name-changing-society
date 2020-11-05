# Name Changing Society

PERN stack: [PostgreSQL](https://www.postgresql.org), [Express](https://expressjs.com), [React](https://reactjs.org) & [Node](https://nodejs.org/en/).

Live App: [Coming Soon]

Some key dependencies:

- [pg-promise](https://github.com/vitaly-t/pg-promise): Promise library for postgresql
- [axios](https://github.com/axios/axios): Promise-based HTTP client for the browser and node.js
- [Material-UI](https://material-ui.com): React component library implementing Material Design
- [React Router](https://github.com/ReactTraining/react-router#readme): Dynamic routing for React

## Setup Instructions

Clone repo to your local machine: `git clone https://github.com/watsbeat/name-changing-society`

### Backend

- Change into backend directory: `cd name-changing-society/backend`
- Install & use the correct node version: `nvm install` and `nvm use` (v14)
- Install npm packages: `npm i`
- Launch the server: `npm start`
- Go to `http://localhost:8091/v1` in your browser or Postman

#### Environment Variables

Add these secrets to a dotenv file:

```env
PORT=8091
PGDATABASE=ncs
PGUSER=<user>
PGPASSWORD=<password>
PGHOST=<host>
PGPORT=<port>
SESSION_SECRET=<some_gibberish>
```

#### Database

```bash
cd <migration-folder>
psql -d ncs -f <migration-file>.sql
```

```bash
brew update
brew install postgres
brew services start postgresql
# or psql postgres
createdb ncs # create database
psql -d ncs # login
#logout
# Setup database schema:
psql ncs < node_modules/connect-pg-simple/table.sql
psql -d ncs < sql/create_users.sql
psql -d ncs < sql/create_names.sql
psql -d ncs < sql/create_citizens.sql
```

## Frontend

In a new terminal:

- Change into frontend directory: `cd name-changing-society/backend`
- Install & use the correct node version: `nvm install` and `nvm use` (v14)
- Install npm packages: `npm i`
- Launch the client app: `npm start`
- Go to `http://localhost:3000/`

## API Endpoints

- POST v1/auth/register
- POST v1/auth/login
- GET v1/auth/logout

- GET v1/names - Get list of names available within the next 28 days

- GET v1/users/:id - Get user's current name
- POST v1/users/:id - Create new name for user
- GET v1/users/:user_id/history - Get user's historical names
