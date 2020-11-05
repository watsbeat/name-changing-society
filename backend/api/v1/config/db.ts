import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

require('dotenv').config();

const dbConfig = {
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 500,
    type: 'postgres'
};

const initOptions = {
    // global event notification
    error(error: { message: string }, e: pgPromise.IEventContext): void {
        // Connection-related errors are reported back
        if (e.cn) {
            console.error(`
                Connection: ${JSON.stringify(e.cn)}
                Event: ${error.message || error}
            `);
        }
    },
    // Check the connection
    connect(client: IClient): void {
        const connectionParams = client.connectionParameters;
        const serverVersion = client.serverVersion;
        console.log(`
            Connected to database: ${connectionParams.database}
            Server version: ${serverVersion}
        `);
    },
};

// Loading and initialising the libary:
const pgp = pgPromise(initOptions);

// Creating a new database instance from the connection details:
const db = pgp(dbConfig);

// Exporting the database object for shared use:
export { db, pgp };
